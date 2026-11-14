import { CarouselModel, CarouselMotion } from './model';

export class CarouselScroll implements CarouselMotion {
    private root?: HTMLElement;

    private track?: HTMLElement;

    private center = false;

    private frame?: number;

    private clone?: HTMLElement;

    private snap?: string;

    private positions: number[] = [];

    private resizeObserver?: ResizeObserver;

    private observedSlides = new Set<Element>();

    constructor(private readonly getModel: () => CarouselModel) {}

    get navigating() {
        return Boolean(this.clone) || this.frame !== undefined;
    }

    mount(root: HTMLElement, track: HTMLElement, center = false) {
        this.center = center;
        if (this.root !== root || this.track !== track) {
            this.dispose();
            this.root = root;
            this.track = track;
            track.addEventListener('scroll', this.handleScroll, { passive: true });
            this.resizeObserver = new window.ResizeObserver(this.handleResize);
        }
        this.refresh();
    }

    refresh = (align?: boolean) => {
        this.observeLayout();
        const { track } = this;
        if (!track || this.navigating) return;

        const previous = this.positions;
        this.positions = ([...track.children] as HTMLElement[]).map(slide =>
            this.position(track, slide)
        );
        const model = this.getModel();
        model.refresh(track.clientWidth ? this.positions : undefined);

        const changed =
            this.positions.length !== previous.length ||
            this.positions.some((left, index) => Math.abs(left - previous[index]) > 1);
        const left = this.positions[model.activeIndex];
        if ((align ?? changed) && left !== undefined) this.navigate(track, left, false);
    };

    dispose() {
        this.interrupt();
        this.track?.removeEventListener('scroll', this.handleScroll);
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
        this.observedSlides.clear();
        this.root = this.track = undefined;
        this.positions = [];
    }

    transition = (index: number, from: number, direction?: -1 | 1) => {
        const { track, root } = this;
        if (!track || !root) return;

        this.interrupt();
        const slides = [...track.children] as HTMLElement[];
        const destination = slides[index];
        if (!destination) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const style = getComputedStyle(root);
        const items = Number.parseFloat(style.getPropertyValue('--bs-carousel-items')) || 1;
        const peek = Number.parseFloat(style.getPropertyValue('--bs-carousel-items-peek')) || 0;
        const variableWidth = slides.some(slide => slide.style.width || slide.style.flexBasis);
        const model = this.getModel();
        const crossingEnd = (direction === 1 && model.atStart) || (direction === -1 && model.atEnd);
        const fullWidth =
            !track.clientWidth ||
            slides.every(
                slide => Math.abs(slide.getBoundingClientRect().width - track.clientWidth) <= 1
            );
        const canLoop =
            model.ends === 'loop' &&
            !reducedMotion &&
            items === 1 &&
            peek === 0 &&
            !this.center &&
            !variableWidth &&
            fullWidth;

        if (crossingEnd && canLoop) this.loop(track, slides[from], destination, direction === 1);
        else this.navigate(track, this.position(track, destination), !reducedMotion);
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

    private handleResize = () => {
        this.interrupt();
        this.refresh(true);
    };

    private handleScroll = () => {
        const { track } = this;
        if (!track || this.navigating) return;

        this.refresh(false);
        const model = this.getModel();
        const index = model.indexes.reduce<number | undefined>(
            (closest, index) =>
                closest === undefined ||
                Math.abs(this.positions[index] - track.scrollLeft) <
                    Math.abs(this.positions[closest] - track.scrollLeft)
                    ? index
                    : closest,
            undefined
        );
        if (index !== undefined && index !== model.activeIndex)
            model.setIndex(index, true, undefined, true);
    };

    private position = (track: HTMLElement, slide: HTMLElement) => {
        if (!track.clientWidth) return slide.offsetLeft;

        const style = getComputedStyle(track);
        const rtl = style.direction === 'rtl';
        const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
        const bounds = track.getBoundingClientRect();
        const padding =
            Number.parseFloat(rtl ? style.scrollPaddingRight : style.scrollPaddingLeft) || 0;

        const rect = slide.getBoundingClientRect();
        const alignment = this.center
            ? (track.clientWidth - rect.width) / 2
            : rtl
              ? track.clientWidth - padding - rect.width
              : padding;
        const left = track.scrollLeft + rect.left - bounds.left - track.clientLeft - alignment;

        return Math.max(rtl ? -maximum : 0, Math.min(left, rtl ? 0 : maximum));
    };

    private navigate = (track: HTMLElement, left: number, smooth: boolean) => {
        if (!smooth || track.scrollLeft === left) {
            track.scrollTo({ left, behavior: 'instant' });

            return;
        }
        this.snap = track.style.scrollSnapType;
        track.style.scrollSnapType = 'none';
        this.animate(track, track.scrollLeft, left);
    };

    private loop = (
        track: HTMLElement,
        from: HTMLElement,
        destination: HTMLElement,
        forward: boolean
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

        if (forward) track.append(clone);
        else track.prepend(clone);

        const start = this.position(track, from);
        const end = this.position(track, clone);

        track.scrollTo({ left: start, behavior: 'instant' });
        this.animate(track, start, end, () => {
            this.interrupt();
            track.scrollTo({ left: this.position(track, destination), behavior: 'instant' });
        });
    };

    private animate = (
        track: HTMLElement,
        start: number,
        end: number,
        complete = this.interrupt
    ) => {
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
