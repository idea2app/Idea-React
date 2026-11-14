import { action, computed, observable } from 'mobx';

export type CarouselEnds = 'loop' | 'wrap' | 'stop';

export class CarouselModel {
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

    private timer?: ReturnType<typeof setTimeout>;

    @observable private accessor hovering = false;
    @observable private accessor visible = true;

    @computed
    get cycling() {
        return this.playing && !this.hovering && this.visible;
    }

    onChange?: (index: number) => unknown;

    onNavigate?: (index: number, from: number, direction?: -1 | 1) => unknown;

    constructor(
        private count: number,
        private ends: CarouselEnds,
        private interval: (index: number) => number
    ) {
        this.indexes = Array.from({ length: count }, (_, index) => index);
    }

    @action
    setIndex = (index: number, userInitiated = false, direction?: -1 | 1, fromScroll = false) => {
        const bounded = Math.max(0, Math.min(index, this.count - 1));
        const nextIndex = this.indexes.findLast(candidate => candidate <= bounded) ?? 0;

        if (nextIndex !== this.activeIndex) {
            const from = this.activeIndex;
            this.activeIndex = nextIndex;
            this.onChange?.(nextIndex);
            if (!fromScroll) this.onNavigate?.(nextIndex, from, direction);
        }
        if (userInitiated) this.pause();
        else this.schedule();
    };

    @action
    next = (userInitiated = false) => {
        if (this.indexes.length < 2) return;

        if (this.atEnd && this.ends === 'stop') {
            if (!userInitiated) this.pause();

            return;
        }
        this.setIndex(
            this.atEnd ? this.indexes[0] : this.indexes[this.indexes.indexOf(this.activeIndex) + 1],
            userInitiated,
            1
        );
    };

    @action
    previous = (userInitiated = false) => {
        if (this.indexes.length < 2) return;

        if (this.atStart && this.ends === 'stop') {
            if (!userInitiated) this.pause();

            return;
        }
        this.setIndex(
            this.atStart
                ? this.indexes[this.indexes.length - 1]
                : this.indexes[this.indexes.indexOf(this.activeIndex) - 1],
            userInitiated,
            -1
        );
    };

    @action
    play = () => {
        this.playing = true;
        this.schedule();
    };

    @action
    pause = () => {
        this.playing = false;
        this.clearTimer();
    };

    @action
    toggle = () => (this.playing ? this.pause() : this.play());

    setHovering = action((hovering: boolean) => {
        this.hovering = hovering;
        this.schedule();
    });

    setVisible = action((visible: boolean) => {
        this.visible = visible;
        this.schedule();
    });

    @action
    update = (
        count: number,
        ends: CarouselEnds,
        interval: (index: number) => number,
        indexes = Array.from({ length: count }, (_, index) => index)
    ) => {
        this.count = count;
        this.ends = ends;
        this.interval = interval;
        if (
            indexes.length !== this.indexes.length ||
            indexes.some((index, i) => index !== this.indexes[i])
        )
            this.indexes = indexes;

        if (!this.indexes.includes(this.activeIndex))
            this.setIndex(this.activeIndex, false, undefined, true);
        else this.schedule();
    };

    dispose = () => this.clearTimer();

    private schedule = () => {
        this.clearTimer();
        if (!this.cycling || this.indexes.length < 2) return;

        this.timer = setTimeout(this.next, Math.max(0, this.interval(this.activeIndex)));
    };

    private clearTimer = () => {
        if (this.timer) clearTimeout(this.timer);
        this.timer = undefined;
    };
}
