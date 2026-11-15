import { CarouselLayout, CarouselMotion } from './model';

export interface CarouselScrollEvents {
    onLayout: (layout: CarouselLayout, align?: boolean) => unknown;
    onScroll: (left: number) => unknown;
    onComplete: (motion: CarouselMotion) => unknown;
    onResize: () => unknown;
}

export class CarouselScroll {
    private root?: HTMLElement;

    private track?: HTMLElement;

    private center = false;

    private frame?: number;

    private clone?: HTMLElement;

    private snap?: string;

    private events?: CarouselScrollEvents;

    private media?: MediaQueryList;

    private resizeObserver?: ResizeObserver;

    private observedSlides = new Set<Element>();

    get navigating() {
        return Boolean(this.clone) || this.frame !== undefined;
    }

    mount(root: HTMLElement, track: HTMLElement, events: CarouselScrollEvents, center = false) {
        this.center = center;
        if (this.root !== root || this.track !== track) {
            this.dispose();
            this.root = root;
            this.track = track;
            track.addEventListener('scroll', this.handleScroll, { passive: true });
            this.resizeObserver = new window.ResizeObserver(this.handleResize);
            this.media = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.media.addEventListener('change', this.handleResize);
        }
        this.events = events;
        this.refresh();
    }

    refresh = (align?: boolean) => {
        this.observeLayout();
        const { root, track } = this;
        if (!root || !track || this.navigating) return;

        const slides = [...track.children] as HTMLElement[];
        const style = getComputedStyle(root);
        this.events?.onLayout(
            {
                positions: slides.map(slide => this.position(track, slide)),
                widths: slides.map(slide => slide.getBoundingClientRect().width),
                viewport: track.clientWidth,
                maximum: Math.max(0, track.scrollWidth - track.clientWidth),
                rtl: getComputedStyle(track).direction === 'rtl',
                items: Number.parseFloat(style.getPropertyValue('--bs-carousel-items')) || 1,
                peek: Number.parseFloat(style.getPropertyValue('--bs-carousel-items-peek')) || 0,
                center: this.center,
                variableWidth: slides.some(slide =>
                    Boolean(slide.style.width || slide.style.flexBasis)
                ),
                reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            },
            align
        );
    };

    dispose() {
        this.interrupt();
        this.track?.removeEventListener('scroll', this.handleScroll);
        this.resizeObserver?.disconnect();
        this.media?.removeEventListener('change', this.handleResize);
        this.resizeObserver = undefined;
        this.media = undefined;
        this.observedSlides.clear();
        this.root = this.track = undefined;
        this.events = undefined;
    }

    apply = (motion?: CarouselMotion) => {
        this.interrupt();
        const { track } = this;
        if (!motion || !track) {
            this.refresh();

            return;
        }
        const slides = [...track.children] as HTMLElement[];
        const complete = () => this.events?.onComplete(motion);
        if (motion.loop)
            this.loop(track, slides[motion.from], slides[motion.index], motion, complete);
        else this.navigate(track, motion.left, motion.smooth, complete);
    };

    interrupt = () => {
        if (this.frame !== undefined) window.cancelAnimationFrame(this.frame);
        this.frame = undefined;
        this.clone?.remove();
        this.clone = undefined;
        if (this.track && this.snap !== undefined) this.track.style.scrollSnapType = this.snap;
        this.snap = undefined;
    };

    private observeLayout = () => {
        const { track, resizeObserver } = this;
        if (!track || !resizeObserver) return;

        resizeObserver.observe(track);
        const slides = new Set(
            [...track.children].filter(slide => !slide.hasAttribute('data-carousel-clone'))
        );
        for (const slide of this.observedSlides)
            if (!slides.has(slide)) resizeObserver.unobserve(slide);
        for (const slide of slides)
            if (!this.observedSlides.has(slide)) resizeObserver.observe(slide);
        this.observedSlides = slides;
    };

    private handleResize = () => this.events?.onResize();

    private handleScroll = () => {
        const { track } = this;
        if (!track || this.navigating) return;

        this.refresh(false);
        this.events?.onScroll(track.scrollLeft);
    };

    private position = (track: HTMLElement, slide: HTMLElement) => {
        if (!track.clientWidth) return slide.offsetLeft;

        const style = getComputedStyle(track);
        const rtl = style.direction === 'rtl';
        const bounds = track.getBoundingClientRect();
        const padding =
            Number.parseFloat(rtl ? style.scrollPaddingRight : style.scrollPaddingLeft) || 0;

        const rect = slide.getBoundingClientRect();
        const alignment = this.center
            ? (track.clientWidth - rect.width) / 2
            : rtl
              ? track.clientWidth - padding - rect.width
              : padding;

        return track.scrollLeft + rect.left - bounds.left - track.clientLeft - alignment;
    };

    private navigate = (
        track: HTMLElement,
        left: number,
        smooth: boolean,
        complete: () => unknown
    ) => {
        if (!smooth || track.scrollLeft === left) {
            track.scrollTo({ left, behavior: 'instant' });
            complete();

            return;
        }
        this.snap = track.style.scrollSnapType;
        track.style.scrollSnapType = 'none';
        this.animate(track, track.scrollLeft, left, complete);
    };

    private loop = (
        track: HTMLElement,
        from: HTMLElement,
        destination: HTMLElement,
        motion: CarouselMotion,
        complete: () => unknown
    ) => {
        this.snap = track.style.scrollSnapType;

        const clone = destination.cloneNode(true) as HTMLElement;
        clone.removeAttribute('id');

        for (const element of clone.querySelectorAll('[id]')) element.removeAttribute('id');

        clone.setAttribute('aria-hidden', 'true');
        clone.inert = true;
        clone.dataset.carouselClone = 'true';
        clone.classList.remove('active');
        this.clone = clone;
        track.style.scrollSnapType = 'none';

        if (motion.loop === 1) track.append(clone);
        else track.prepend(clone);

        const start = this.position(track, from);
        const end = this.position(track, clone);

        track.scrollTo({ left: start, behavior: 'instant' });
        this.animate(track, start, end, () => {
            this.interrupt();
            track.scrollTo({ left: motion.left, behavior: 'instant' });
            complete();
        });
    };

    private animate = (track: HTMLElement, start: number, end: number, complete: () => unknown) => {
        let startedAt: number | undefined;

        const animate = (time: number) => {
            startedAt ??= time;
            const progress = Math.max(0, Math.min(1, (time - startedAt) / 400));
            const eased = 1 - (1 - progress) ** 3;

            track.scrollTo({ left: start + (end - start) * eased, behavior: 'instant' });

            if (progress < 1) this.frame = window.requestAnimationFrame(animate);
            else complete();
        };
        this.frame = window.requestAnimationFrame(animate);
    };
}
