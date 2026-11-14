export class CarouselScroll {
    private frame?: number;

    private clone?: HTMLElement;

    private track?: HTMLElement;

    private snap = '';

    get looping() {
        return Boolean(this.clone) || this.frame !== undefined;
    }

    position = (track: HTMLElement, slide: HTMLElement, center = false) => {
        if (!track.clientWidth) return slide.offsetLeft;

        const style = getComputedStyle(track);
        const rtl = style.direction === 'rtl';
        const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
        const bounds = track.getBoundingClientRect();
        const padding =
            Number.parseFloat(rtl ? style.scrollPaddingRight : style.scrollPaddingLeft) || 0;

        const rect = slide.getBoundingClientRect();
        const alignment = center
            ? (track.clientWidth - rect.width) / 2
            : rtl
              ? track.clientWidth - padding - rect.width
              : padding;
        const left = track.scrollLeft + rect.left - bounds.left - track.clientLeft - alignment;

        return Math.max(rtl ? -maximum : 0, Math.min(left, rtl ? 0 : maximum));
    };

    targets = (track: HTMLElement, center = false) =>
        ([...track.children] as HTMLElement[])
            .map((slide, index) => ({ index, left: this.position(track, slide, center) }))
            .filter(
                (target, index, targets) =>
                    !track.clientWidth ||
                    !index ||
                    Math.abs(target.left - targets[index - 1].left) > 1
            );

    navigate = (track: HTMLElement, left: number, smooth: boolean) => {
        this.dispose();
        if (!smooth || track.scrollLeft === left) {
            track.scrollTo({ left, behavior: 'instant' });

            return;
        }
        this.track = track;
        this.snap = track.style.scrollSnapType;
        track.style.scrollSnapType = 'none';
        this.animate(track, track.scrollLeft, left);
    };

    loop = (track: HTMLElement, from: HTMLElement, destination: HTMLElement, forward: boolean) => {
        this.dispose();
        this.track = track;
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
            this.dispose();
            track.scrollTo({ left: this.position(track, destination), behavior: 'instant' });
        });
    };

    private animate = (track: HTMLElement, start: number, end: number, complete = this.dispose) => {
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

    dispose = () => {
        if (this.frame !== undefined) window.cancelAnimationFrame(this.frame);
        this.frame = undefined;
        this.clone?.remove();
        this.clone = undefined;
        if (this.track) this.track.style.scrollSnapType = this.snap;
        this.track = undefined;
    };
}
