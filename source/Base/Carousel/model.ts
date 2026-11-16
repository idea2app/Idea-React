import { action, computed, observable, reaction } from 'mobx';

export type CarouselEnds = 'loop' | 'wrap' | 'stop';

export interface CarouselModelOptions {
    intervals: number[];
    ends: CarouselEnds;
    onChange?: (index: number) => unknown;
}

export interface CarouselMotion {
    index: number;
    from: number;
    left: number;
    smooth: boolean;
    loop?: -1 | 1;
}

export interface CarouselLayout {
    positions: number[];
    widths: number[];
    viewport: number;
    maximum: number;
    rtl: boolean;
    items: number;
    peek: number;
    center: boolean;
    variableWidth: boolean;
    reducedMotion: boolean;
}

export abstract class CarouselModel {
    abstract readonly fade: boolean;

    get navigating() {
        return Boolean(this.motion?.smooth);
    }

    @observable accessor motion: CarouselMotion | undefined;

    @observable accessor activeIndex = 0;

    @observable accessor playing = false;

    @observable accessor indexes: number[] = [];

    @computed
    get atStart() {
        return this.activeIndex === this.indexes[0];
    }

    @computed
    get atEnd() {
        return this.activeIndex === this.indexes.at(-1);
    }

    @computed
    get canPrevious() {
        return this.options.ends !== 'stop' || !this.atStart;
    }

    @computed
    get canNext() {
        return this.options.ends !== 'stop' || !this.atEnd;
    }

    @computed
    get interval() {
        return this.options.intervals[this.activeIndex] ?? 5000;
    }

    @observable protected accessor options: CarouselModelOptions;

    protected layout?: CarouselLayout;

    protected positions: number[] = [];

    private timer?: ReturnType<typeof setTimeout>;

    private stopPlayback?: () => void;

    @observable private accessor hovering = false;
    @observable private accessor visible = true;

    @computed
    get cycling() {
        return this.playing && !this.hovering && this.visible;
    }

    constructor(options: CarouselModelOptions) {
        this.options = options;
        this.indexes = Array.from({ length: options.intervals.length }, (_, index) => index);
    }

    mount() {
        if (this.stopPlayback) return;

        this.stopPlayback = reaction(
            () => [this.cycling && this.indexes.length > 1, this.activeIndex, this.interval],
            this.schedule,
            {
                fireImmediately: true,
                equals: (next, previous) => next.every((value, index) => value === previous[index])
            }
        );
    }

    @action
    restore(previous: CarouselModel) {
        this.activeIndex = previous.activeIndex;
        this.playing = previous.playing;
        this.hovering = previous.hovering;
        this.visible = previous.visible;
    }

    @action
    setIndex = (index: number, userInitiated = false, direction?: -1 | 1, fromScroll = false) => {
        if (!this.navigating || fromScroll) {
            const bounded = Math.max(0, Math.min(index, this.options.intervals.length - 1));
            const nextIndex = this.indexes.findLast(candidate => candidate <= bounded) ?? 0;

            if (nextIndex !== this.activeIndex) {
                const from = this.activeIndex;
                this.activeIndex = nextIndex;
                this.options.onChange?.(nextIndex);

                if (!fromScroll) this.motion = this.createMotion?.(nextIndex, from, direction);
            }
        }
        if (userInitiated) this.pause();
    };

    next = (userInitiated = false) => this.move(1, userInitiated);

    previous = (userInitiated = false) => this.move(-1, userInitiated);

    @action
    play = () => (this.playing = true);

    @action
    pause = () => (this.playing = false);

    @action
    toggle = () => (this.playing ? this.pause() : this.play());

    setHovering = action((hovering: boolean) => (this.hovering = hovering));

    setVisible = action((visible: boolean) => (this.visible = visible));

    @action
    update(options: CarouselModelOptions) {
        if (options.intervals.length !== this.options.intervals.length) this.interrupt();

        this.options = options;
    }

    refresh = action((layout?: CarouselLayout, align?: boolean) => {
        const previous = this.positions;
        this.layout = layout;
        this.positions =
            layout?.positions.map(left =>
                layout.viewport
                    ? Math.max(
                          layout.rtl ? -layout.maximum : 0,
                          Math.min(left, layout.rtl ? 0 : layout.maximum)
                      )
                    : left
            ) ?? [];
        const indexes = this.readIndexes(layout?.viewport ? this.positions : undefined);
        if (
            indexes.length !== this.indexes.length ||
            indexes.some((index, i) => index !== this.indexes[i])
        )
            this.indexes = indexes;

        this.setIndex(this.activeIndex, false, undefined, true);

        const changed =
            previous.length !== this.positions.length ||
            this.positions.some((left, index) => Math.abs(left - previous[index]) > 1);

        if ((align ?? changed) && layout && this.positions[this.activeIndex] !== undefined)
            this.motion = this.createMotion?.(this.activeIndex, this.activeIndex);
    });

    syncScroll = action((left: number) => {
        if (this.navigating) return;

        const index = this.indexes.reduce<number | undefined>(
            (closest, index) =>
                closest === undefined ||
                Math.abs(this.positions[index] - left) < Math.abs(this.positions[closest] - left)
                    ? index
                    : closest,
            undefined
        );
        if (index !== undefined && index !== this.activeIndex)
            this.setIndex(index, true, undefined, true);
    });

    complete = action((motion: CarouselMotion) => {
        if (this.motion === motion) this.motion = undefined;
    });

    interrupt = action(() => (this.motion = undefined));

    dispose() {
        this.stopPlayback?.();
        this.stopPlayback = undefined;
        this.clearTimer();
        this.interrupt();
    }

    protected readIndexes(positions = this.options.intervals) {
        return [...positions.keys()];
    }

    protected createMotion?: (
        index: number,
        from: number,
        direction?: -1 | 1
    ) => CarouselMotion | undefined;

    private advance = () => {
        const index = this.activeIndex;
        this.next();
        if (index === this.activeIndex) this.schedule();
    };

    private schedule = () => {
        this.clearTimer();

        if (this.cycling && this.indexes.length > 1)
            this.timer = setTimeout(this.advance, Math.max(0, this.interval));
    };

    @action
    private move(direction: -1 | 1, userInitiated: boolean) {
        const { indexes } = this;
        if (indexes.length < 2) return;

        if (!(direction === 1 ? this.canNext : this.canPrevious)) {
            if (!userInitiated) this.pause();

            return;
        }
        const position =
            (indexes.indexOf(this.activeIndex) + direction + indexes.length) % indexes.length;

        this.setIndex(indexes[position], userInitiated, direction);
    }

    private clearTimer = () => {
        if (this.timer !== undefined) clearTimeout(this.timer);
        this.timer = undefined;
    };
}

export class ScrollCarouselModel extends CarouselModel {
    readonly fade = false;

    protected readIndexes(positions?: number[]) {
        return positions
            ? positions.flatMap((left, index) =>
                  !index || Math.abs(left - positions[index - 1]) > 1 ? [index] : []
              )
            : super.readIndexes();
    }

    protected createMotion = (index: number, from: number, direction?: -1 | 1) => {
        const { layout, positions } = this;
        if (!layout) return undefined;

        const crossingEnd = (direction === 1 && this.atStart) || (direction === -1 && this.atEnd);
        const canLoop =
            this.options.ends === 'loop' &&
            !layout.reducedMotion &&
            layout.items === 1 &&
            layout.peek === 0 &&
            !layout.center &&
            !layout.variableWidth &&
            (!layout.viewport ||
                layout.widths.every(width => Math.abs(width - layout.viewport) <= 1));

        return {
            index,
            from,
            left: positions[index],
            smooth: index !== from && !layout.reducedMotion,
            loop: crossingEnd && canLoop ? direction : undefined
        };
    };
}

export class FadeCarouselModel extends CarouselModel {
    readonly fade = true;
}
