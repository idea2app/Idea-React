import { action, computed, observable, reaction } from 'mobx';

export type CarouselEnds = 'loop' | 'wrap' | 'stop';

export interface CarouselModelOptions {
    intervals: number[];
    ends: CarouselEnds;
    onChange?: (index: number) => unknown;
}

export interface CarouselMotion {
    readonly navigating: boolean;
    transition: (index: number, from: number, direction?: -1 | 1) => unknown;
    interrupt: () => unknown;
}

export abstract class CarouselModel {
    abstract readonly fade: boolean;

    get navigating() {
        return this.motion?.navigating ?? false;
    }

    get ends() {
        return this.options.ends;
    }

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

    private timer?: ReturnType<typeof setTimeout>;

    private stopPlayback?: () => void;

    @observable private accessor hovering = false;
    @observable private accessor visible = true;

    @computed
    get cycling() {
        return this.playing && !this.hovering && this.visible;
    }

    constructor(
        options: CarouselModelOptions,
        private readonly motion?: CarouselMotion
    ) {
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
                if (!fromScroll) this.motion?.transition(nextIndex, from, direction);
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

    refresh = action((positions?: number[]) => {
        const indexes = this.readIndexes(positions);
        if (
            indexes.length !== this.indexes.length ||
            indexes.some((index, i) => index !== this.indexes[i])
        )
            this.indexes = indexes;

        this.setIndex(this.activeIndex, false, undefined, true);
    });

    interrupt = () => this.motion?.interrupt();

    dispose() {
        this.stopPlayback?.();
        this.stopPlayback = undefined;
        this.clearTimer();
        this.interrupt();
    }

    protected readIndexes(positions = this.options.intervals) {
        return [...positions.keys()];
    }

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
}

export class FadeCarouselModel extends CarouselModel {
    readonly fade = true;
}
