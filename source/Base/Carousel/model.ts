import { action, computed, observable } from 'mobx';

export type CarouselEnds = 'loop' | 'wrap' | 'stop';

export class CarouselModel {
    @observable accessor activeIndex = 0;

    @observable accessor playing = false;

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
    ) {}

    @action
    setIndex = (index: number, userInitiated = false, direction?: -1 | 1, fromScroll = false) => {
        const nextIndex = Math.max(0, Math.min(index, this.count - 1));

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
        if (this.activeIndex === this.count - 1 && this.ends === 'stop') {
            if (!userInitiated) this.pause();
            return;
        }
        this.setIndex(
            this.activeIndex === this.count - 1 ? 0 : this.activeIndex + 1,
            userInitiated,
            1
        );
    };

    @action
    previous = (userInitiated = false) => {
        if (this.activeIndex === 0 && this.ends === 'stop') {
            if (!userInitiated) this.pause();
            return;
        }
        this.setIndex(
            this.activeIndex === 0 ? this.count - 1 : this.activeIndex - 1,
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

    update = (count: number, ends: CarouselEnds, interval: (index: number) => number) => {
        this.count = count;
        this.ends = ends;
        this.interval = interval;

        if (this.activeIndex >= count) this.setIndex(Math.max(0, count - 1));
        else this.schedule();
    };

    dispose = () => this.clearTimer();

    private schedule = () => {
        this.clearTimer();
        if (!this.cycling || this.count < 2) return;

        this.timer = setTimeout(this.next, Math.max(0, this.interval(this.activeIndex)));
    };

    private clearTimer = () => {
        if (this.timer) clearTimeout(this.timer);
        this.timer = undefined;
    };
}
