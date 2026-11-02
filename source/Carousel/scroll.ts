export class CarouselScroll {
    private frame?: number;

    private clone?: HTMLElement;

    private track?: HTMLElement;

    private snap = '';

    get looping() {
        return Boolean(this.clone) || this.frame !== undefined;
    }

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

        const start = from.offsetLeft;
        const end = clone.offsetLeft;
        track.scrollTo({ left: start, behavior: 'instant' });
        this.animate(track, start, end, () => {
            this.dispose();
            track.scrollTo({ left: destination.offsetLeft, behavior: 'instant' });
        });
    };

    private animate = (track: HTMLElement, start: number, end: number, complete = this.dispose) => {
        const startedAt = window.performance.now();
        const animate = (time: number) => {
            const progress = Math.min(1, (time - startedAt) / 400);
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
