import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, lazy, Suspense } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Carousel, CarouselSlide } from '../../source/Base/Carousel';
import {
    CarouselLayout,
    FadeCarouselModel,
    ScrollCarouselModel
} from '../../source/Base/Carousel/model';

const wideLayout: CarouselLayout = {
    positions: [0, 414, 828, 1242],
    widths: [390, 390, 390, 390],
    viewport: 936,
    maximum: 696,
    rtl: false,
    items: 1,
    peek: 0,
    center: false,
    variableWidth: true,
    reducedMotion: false
};

it('computes reachable scroll pages and logical fade pages through the same numeric model API', () => {
    const options = { intervals: [1000, 1000, 1000, 1000], ends: 'stop' as const };
    const scroll = new ScrollCarouselModel(options);
    const fade = new FadeCarouselModel(options);
    const destinations: number[] = [];

    for (const model of [scroll, fade]) {
        model.refresh(wideLayout);

        for (let step = 0; step < 4; step++) {
            model.next();

            if (model.motion) {
                destinations.push(model.motion.left);
                model.complete(model.motion);
            }
        }
    }
    assert.deepEqual([...scroll.indexes], [0, 1, 2]);
    assert.deepEqual([...fade.indexes], [0, 1, 2, 3]);
    assert.equal(scroll.activeIndex, 2);
    assert.equal(fade.activeIndex, 3);
    assert.deepEqual(destinations, [414, 696]);
    assert.equal(scroll.canNext, false);

    scroll.previous();
    const { motion } = scroll;
    assert.ok(motion);

    scroll.previous();

    assert.equal(scroll.activeIndex, 1);
    assert.equal(scroll.motion, motion);

    scroll.complete(motion);
    scroll.previous();
    const nextMotion = scroll.motion;
    scroll.complete(motion);

    assert.equal(scroll.activeIndex, 0);
    assert.equal(scroll.motion, nextMotion);
    assert.equal(nextMotion?.left, 0);

    scroll.interrupt();
    scroll.play();
    scroll.syncScroll(414);

    assert.equal(scroll.activeIndex, 1);
    assert.equal(scroll.playing, false);
    assert.equal(scroll.motion, undefined);
});

it('chooses seamless loop, smooth wrap, and reduced-motion plans from measured data', () => {
    const single: CarouselLayout = {
        ...wideLayout,
        positions: [0, 936, 1872, 2808],
        widths: [936, 936, 936, 936],
        maximum: 2808,
        variableWidth: false
    };
    for (const layout of [
        single,
        { ...single, items: 2 },
        { ...single, variableWidth: true },
        { ...single, reducedMotion: true }
    ]) {
        const model = new ScrollCarouselModel({
            intervals: [1000, 1000, 1000, 1000],
            ends: 'loop'
        });
        model.refresh(layout);
        model.interrupt();
        model.previous(true);

        assert.equal(model.activeIndex, 3);
        assert.equal(model.motion?.left, 2808);
        assert.equal(model.motion?.loop, layout === single ? -1 : undefined);
        assert.equal(model.motion?.smooth, !layout.reducedMotion);
    }
});

it('renders carousel slides, controls, indicators, and accessible slide state', () => {
    render(
        <Carousel aria-label="Featured" indicators>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
            <CarouselSlide>Third</CarouselSlide>
        </Carousel>
    );
    const carousel = screen.getByRole('region', { name: 'Featured' });

    assert.ok(carousel.classList.contains('carousel'));
    assert.equal(screen.getAllByRole('button', { name: /^Slide/ }).length, 3);
    assert.equal(screen.getByText('First').getAttribute('aria-hidden'), 'false');
    assert.equal(screen.getByText('Second').getAttribute('aria-hidden'), 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    assert.equal(screen.getByText('First').getAttribute('aria-hidden'), 'true');
    assert.equal(screen.getByText('Second').getAttribute('aria-hidden'), 'false');
    assert.equal(
        screen.getByRole('button', { name: 'Slide 2' }).getAttribute('aria-current'),
        'true'
    );
});

it('renders safely during server-side rendering', () => {
    const markup = renderToStaticMarkup(
        <Carousel aria-label="Server carousel">
            <CarouselSlide>Server rendered slide</CarouselSlide>
        </Carousel>
    );
    assert.match(markup, /aria-roledescription="carousel"/);
    assert.match(markup, /Server rendered slide/);
});

it('uses Bootstrap 6 overlay rows, button variants, and indicator styling hooks', () => {
    const { container } = render(
        <Carousel
            id="overlay-gallery"
            controlsPlacement="overlay"
            indicatorPlacement="between"
            indicators
        >
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    const carousel = screen.getByRole('region');
    const row = container.querySelector('.carousel-overlay-controls');

    assert.ok(carousel.classList.contains('carousel-overlay'));
    assert.equal(row?.children.length, 3);
    assert.equal(row?.firstElementChild, screen.getByRole('button', { name: 'Previous' }));
    assert.equal(row?.lastElementChild, screen.getByRole('button', { name: 'Next' }));
    assert.equal(
        screen.getByRole('button', { name: 'Previous' }).className,
        'btn-subtle theme-secondary btn-sm btn-icon'
    );
    assert.equal(
        screen.getByRole('button', { name: 'Slide 1' }).getAttribute('data-bs-target'),
        '#overlay-gallery'
    );
    assert.equal(container.querySelector('.carousel-control-prev'), null);
    assert.equal(container.querySelector('.carousel-control-next'), null);
});

it('composes top-row content, rounded viewports, and individually sized slides', () => {
    const { container } = render(
        <Carousel
            controlsPlacement="top"
            controlsStart={<h5>Mixed widths</h5>}
            innerClassName="rounded-5"
            itemsGap="1rem"
            auto
        >
            <CarouselSlide style={{ width: 160 }}>A</CarouselSlide>
            <CarouselSlide style={{ width: 320 }}>B</CarouselSlide>
        </Carousel>
    );
    const carousel = screen.getByRole('region');
    const track = container.querySelector('.carousel-inner');

    assert.ok(carousel.classList.contains('carousel-auto'));
    assert.equal(carousel.firstElementChild?.firstElementChild?.textContent, 'Mixed widths');
    assert.equal(track?.className, 'carousel-inner rounded-5');
    assert.equal(screen.getByText('A').style.width, '160px');
    assert.equal(screen.getByText('B').style.width, '320px');
    assert.equal(carousel.hasAttribute('auto'), false);
    assert.equal(carousel.hasAttribute('controlsStart'), false);
    assert.equal(screen.getByRole('button', { name: 'Next' }).className, 'btn-sm btn-icon');
});

it('places indicators after grouped buttons and omits empty controls rows', () => {
    const { container, rerender } = render(
        <Carousel controlsPlacement="bottom" indicatorPlacement="end" indicators>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    const carousel = screen.getByRole('region');

    assert.ok(
        carousel.lastElementChild?.lastElementChild?.classList.contains('carousel-indicators')
    );
    assert.equal(
        screen.getByRole('button', { name: 'Slide 1' }).getAttribute('data-bs-target'),
        ''
    );

    rerender(
        <Carousel controls={false}>
            <CarouselSlide>First</CarouselSlide>
        </Carousel>
    );
    assert.equal(container.querySelector('.carousel-overlay-controls'), null);
});

it('uses each slide interval for autoplay progress and pauses its fill on hover', () => {
    const ref = createRef<Carousel>();
    const { container } = render(
        <Carousel ref={ref} controlsPlacement="bottom" controls={false} autoplay indicators>
            <CarouselSlide interval={2000}>First</CarouselSlide>
            <CarouselSlide interval={4000}>Second</CarouselSlide>
        </Carousel>
    );
    const carousel = screen.getByRole('region');

    assert.ok(carousel.classList.contains('carousel-playing'));
    assert.equal(carousel.style.getPropertyValue('--bs-carousel-interval'), '2000ms');
    assert.equal(container.querySelectorAll('[data-carousel-action="toggle"]').length, 1);
    assert.equal(container.querySelector('[data-carousel-action="next"]'), null);

    fireEvent.mouseEnter(carousel);

    assert.equal(ref.current?.store.cycling, false);

    fireEvent.mouseLeave(carousel);

    assert.equal(ref.current?.store.cycling, true);

    fireEvent.click(screen.getByRole('button', { name: 'Slide 2' }));

    assert.equal(carousel.classList.contains('carousel-playing'), false);

    fireEvent.click(screen.getByRole('button', { name: 'Play' }));

    assert.equal(carousel.style.getPropertyValue('--bs-carousel-interval'), '4000ms');
});

it('moves focus to the opposite control when stop-at-ends disables the focused button', () => {
    render(
        <Carousel ends="stop">
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Last</CarouselSlide>
        </Carousel>
    );
    const next = screen.getByRole<HTMLButtonElement>('button', { name: 'Next' });
    const previous = screen.getByRole<HTMLButtonElement>('button', { name: 'Previous' });

    next.focus();
    fireEvent.click(next);

    assert.equal(next.disabled, true);
    assert.equal(document.activeElement, previous);

    fireEvent.click(previous);

    assert.equal(previous.disabled, true);
    assert.equal(document.activeElement, next);
});

it('preserves one slide boundary and metadata for lazy client-component references', async () => {
    const LazySlide = lazy(async () => ({ default: CarouselSlide }));

    const { container } = await act(async () =>
        render(
            <Suspense fallback="Loading slides">
                <Carousel aria-label="Serialized gallery" indicators>
                    <LazySlide id="lazy-first" interval={1000}>
                        First serialized slide
                    </LazySlide>
                    <LazySlide id="lazy-second" interval={2000}>
                        Second serialized slide
                    </LazySlide>
                </Carousel>
            </Suspense>
        )
    );
    const track = container.querySelector('.carousel-inner') as HTMLElement;

    assert.equal(track.querySelectorAll('.carousel-item').length, 2);
    assert.equal(track.querySelector('.carousel-item .carousel-item'), null);
    assert.equal(track.firstElementChild?.id, 'lazy-first');
    assert.equal(track.firstElementChild?.getAttribute('data-bs-interval'), '1000');
    assert.equal(track.firstElementChild?.getAttribute('aria-hidden'), 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    assert.equal(track.lastElementChild?.getAttribute('aria-hidden'), 'false');
    assert.equal(
        screen.getByRole('button', { name: 'Slide 2' }).getAttribute('aria-current'),
        'true'
    );
});

it('syncs its selected slide with native scroll-snap dragging', () => {
    const { container } = render(
        <Carousel aria-label="Scrollable carousel" controls={false}>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    const track = container.querySelector('.carousel-inner') as HTMLElement;
    const [first, second] = [...track.children] as HTMLElement[];

    Object.defineProperty(first, 'offsetLeft', { configurable: true, value: 0 });
    Object.defineProperty(second, 'offsetLeft', { configurable: true, value: 100 });
    Object.defineProperty(track, 'scrollLeft', { configurable: true, value: 100 });

    fireEvent.scroll(track);

    assert.equal(screen.getByText('Second').getAttribute('aria-hidden'), 'false');
});

it('supports fade, dark, multiple-item sizing, keyboard controls, and stop-at-ends behavior', () => {
    render(
        <Carousel aria-label="Gallery" ends="stop" items={3} itemsGap="1rem" fade dark keyboard>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide interval={3000}>Second</CarouselSlide>
        </Carousel>
    );
    const carousel = screen.getByRole('region', { name: 'Gallery' });

    assert.ok(carousel.classList.contains('carousel-fade'));
    assert.ok(carousel.classList.contains('carousel-dark'));
    assert.equal(carousel.style.getPropertyValue('--bs-carousel-items'), '3');
    assert.equal(screen.getByText('Second').getAttribute('data-bs-interval'), '3000');

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });

    assert.equal(screen.getByText('Second').getAttribute('aria-hidden'), 'false');
    assert.equal(screen.getByRole('button', { name: 'Next' }).hasAttribute('disabled'), true);

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

    assert.equal(screen.getByText('First').getAttribute('aria-hidden'), 'false');
});

it('pauses autoplay when a visitor selects a slide and can be resumed', () => {
    render(
        <Carousel interval={60_000} autoplay playPause indicators>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    screen.getByRole('button', { name: 'Pause' });

    fireEvent.click(screen.getByRole('button', { name: 'Slide 2' }));

    assert.equal(screen.getByRole('button', { name: 'Play' }).getAttribute('aria-label'), 'Play');
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));

    assert.equal(screen.getByRole('button', { name: 'Pause' }).getAttribute('aria-label'), 'Pause');
});

it('cycles on its interval and clears the pending timer when unmounted', () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    const onChange = mock.fn();

    const { unmount } = render(
        <Carousel interval={100} autoplay onChange={onChange}>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    act(() => mock.timers.tick(100));

    assert.equal(screen.getByText('Second').getAttribute('aria-hidden'), 'false');
    assert.equal(onChange.mock.callCount(), 1);
    unmount();

    act(() => mock.timers.tick(500));

    assert.equal(onChange.mock.callCount(), 1);
    mock.timers.reset();
});

it('loops forward through an inert temporary slide and teleports only after the transition', () => {
    let frame: FrameRequestCallback | undefined;

    const request = mock.method(
        window,
        'requestAnimationFrame',
        (callback: FrameRequestCallback) => {
            frame = callback;

            return 42;
        }
    );
    const cancel = mock.method(window, 'cancelAnimationFrame');

    const { container, unmount } = render(
        <Carousel aria-label="Looping gallery" indicators>
            <CarouselSlide id="original-slide">
                <span id="original-content">First</span>
            </CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    const track = container.querySelector('.carousel-inner') as HTMLElement;
    const [first, second] = [...track.children] as HTMLElement[];

    Object.defineProperty(first, 'offsetLeft', { configurable: true, value: 0 });
    Object.defineProperty(second, 'offsetLeft', { configurable: true, value: 100 });

    const cloneNode = first.cloneNode.bind(first);

    mock.method(first, 'cloneNode', (deep?: boolean) => {
        const clone = cloneNode(deep) as HTMLElement;
        Object.defineProperty(clone, 'offsetLeft', { configurable: true, value: 200 });

        return clone;
    });
    const scrollTo = mock.fn((options: ScrollToOptions) => {
        track.scrollLeft = options.left ?? 0;
    });
    mock.method(track, 'scrollTo', scrollTo);
    fireEvent.scroll(track);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    act(() => {
        frame?.(0);
        frame?.(400);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    const clone = track.querySelector<HTMLElement>('[data-carousel-clone]');

    assert.equal(clone?.inert, true);
    assert.equal(clone?.getAttribute('aria-hidden'), 'true');
    assert.equal(clone?.querySelector('[id]'), null);
    assert.equal(clone?.id, '');
    assert.equal(screen.getAllByRole('button', { name: /^Slide/ }).length, 2);
    assert.equal(scrollTo.mock.calls.at(-1)?.arguments[0].left, 100);

    act(() => {
        frame?.(500);
        frame?.(900);
    });

    assert.equal(track.querySelector('[data-carousel-clone]'), null);
    assert.equal(scrollTo.mock.calls.at(-2)?.arguments[0].left, 200);
    assert.equal(scrollTo.mock.calls.at(-1)?.arguments[0].left, 0);
    assert.equal(track.children.length, 2);
    assert.equal(
        screen.getByRole('button', { name: 'Slide 1' }).getAttribute('aria-current'),
        'true'
    );
    unmount();
    request.mock.restore();
    cancel.mock.restore();
});

it('cancels loop frames and removes the temporary slide when unmounted', () => {
    const request = mock.method(window, 'requestAnimationFrame', () => 123);
    const cancel = mock.method(window, 'cancelAnimationFrame');

    const { container, unmount } = render(
        <Carousel>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    const track = container.querySelector('.carousel-inner') as HTMLElement;

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    assert.equal(track.querySelectorAll('[data-carousel-clone]').length, 1);
    unmount();

    assert.equal(cancel.mock.calls.at(-1)?.arguments[0], 123);
    assert.equal(track.querySelectorAll('[data-carousel-clone]').length, 0);
    request.mock.restore();
    cancel.mock.restore();
});

it('loops backward through a prepended slide without changing its logical slide count', () => {
    let frame: FrameRequestCallback | undefined;

    const request = mock.method(
        window,
        'requestAnimationFrame',
        (callback: FrameRequestCallback) => {
            frame = callback;

            return 99;
        }
    );
    const { container, unmount } = render(
        <Carousel indicators>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    const track = container.querySelector('.carousel-inner') as HTMLElement;
    const [first, second] = [...track.children] as HTMLElement[];

    for (const slide of [first, second])
        Object.defineProperty(slide, 'offsetLeft', {
            configurable: true,
            get: () => [...track.children].indexOf(slide) * 100
        });
    const scrollTo = mock.fn((options: ScrollToOptions) => {
        track.scrollLeft = options.left ?? 0;
    });
    mock.method(track, 'scrollTo', scrollTo);
    fireEvent.scroll(track);

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    assert.ok(track.firstElementChild?.hasAttribute('data-carousel-clone'));
    assert.equal(track.scrollLeft, 100);
    assert.equal(screen.getAllByRole('button', { name: /^Slide/ }).length, 2);

    act(() => {
        frame?.(0);
        frame?.(400);
    });

    assert.equal(track.children.length, 2);
    assert.equal(scrollTo.mock.calls.at(-2)?.arguments[0].left, 0);
    assert.equal(track.scrollLeft, 100);
    assert.equal(
        screen.getByRole('button', { name: 'Slide 2' }).getAttribute('aria-current'),
        'true'
    );
    unmount();
    request.mock.restore();
});

it('falls back to an immediate wrap when reduced motion is requested', () => {
    const matchMedia = window.matchMedia.bind(window);

    const media = mock.method(window, 'matchMedia', (query: string) => {
        const result = matchMedia(query);
        Object.defineProperty(result, 'matches', { value: true });

        return result;
    });
    const { container, unmount } = render(
        <Carousel>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    const track = container.querySelector('.carousel-inner') as HTMLElement;
    const scrollTo = mock.fn<(options: ScrollToOptions) => unknown>();
    mock.method(track, 'scrollTo', scrollTo);

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    assert.equal(track.querySelector('[data-carousel-clone]'), null);
    assert.equal(scrollTo.mock.calls.at(-1)?.arguments[0].behavior, 'instant');
    unmount();
    media.mock.restore();
});

it('interrupts a running loop and aligns immediately when reduced motion changes', t => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    t.mock.method(window, 'matchMedia', () => media);
    t.mock.method(window, 'requestAnimationFrame', () => 123);
    const cancel = t.mock.method(window, 'cancelAnimationFrame');

    const ref = createRef<Carousel>();
    const { container } = render(
        <Carousel ref={ref}>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    const track = container.querySelector<HTMLElement>('.carousel-inner')!;
    Object.defineProperty(track.children[1], 'offsetLeft', { value: 100 });
    t.mock.method(track, 'scrollTo', ({ left = 0 }: ScrollToOptions) => {
        track.scrollLeft = left;
    });
    fireEvent.scroll(track);
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    assert.ok(track.querySelector('[data-carousel-clone]'));

    Object.defineProperty(media, 'matches', { configurable: true, value: true });
    act(() => media.dispatchEvent(new window.Event('change')));

    assert.equal(track.querySelector('[data-carousel-clone]'), null);
    assert.equal(track.scrollLeft, 100);
    assert.equal(ref.current?.store.activeIndex, 1);
    assert.equal(ref.current?.store.navigating, false);
    assert.ok(cancel.mock.calls.some(({ arguments: args }) => args[0] === 123));
});

it('uses the first animation frame as its clock and clamps early frames in both directions', () => {
    let frame: FrameRequestCallback | undefined;
    const request = mock.method(
        window,
        'requestAnimationFrame',
        (callback: FrameRequestCallback) => {
            frame = callback;

            return 1;
        }
    );
    const ref = createRef<Carousel>();
    const { container } = render(
        <Carousel ref={ref}>
            <CarouselSlide>First</CarouselSlide>
            <CarouselSlide>Second</CarouselSlide>
        </Carousel>
    );
    const track = container.querySelector<HTMLElement>('.carousel-inner')!;
    Object.defineProperty(track.children[1], 'offsetLeft', { value: 696 });
    const positions: number[] = [];
    mock.method(track, 'scrollTo', ({ left = 0 }: ScrollToOptions) => {
        positions.push(left);
        track.scrollLeft = left;
    });
    fireEvent.scroll(track);

    for (const [start, end] of [
        [0, 696],
        [696, 0]
    ]) {
        track.scrollLeft = start;
        track.style.scrollSnapType = 'x mandatory';
        positions.length = 0;
        act(() => ref.current!.store.setIndex(end ? 1 : 0));
        frame?.(-100);
        frame?.(-101);
        frame?.(100);
        frame?.(300);

        assert.deepEqual(positions.slice(0, 2), [start, start]);
        assert.ok(positions[2] > 0 && positions[2] < 696);
        assert.equal(positions.at(-1), end);
        assert.equal(track.style.scrollSnapType, 'x mandatory');
    }

    act(() => ref.current!.store.setIndex(1));
    ref.current!.store.interrupt();

    assert.equal(ref.current!.store.navigating, false);
    assert.equal(track.style.scrollSnapType, 'x mandatory');
    request.mock.restore();
});

it('shares reachable wide-card positions across controls, indicators, gestures, autoplay, and wrap', () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    let frame: FrameRequestCallback | undefined;
    const request = mock.method(
        window,
        'requestAnimationFrame',
        (callback: FrameRequestCallback) => {
            frame = callback;

            return 2;
        }
    );
    const ref = createRef<Carousel>();
    const { container, rerender, unmount } = render(
        <Carousel ref={ref} auto ends="stop" indicators interval={1000}>
            {[0, 1, 2, 3].map(index => (
                <CarouselSlide key={index}>{index}</CarouselSlide>
            ))}
        </Carousel>
    );
    const track = container.querySelector('.carousel-inner') as HTMLElement;
    Object.defineProperties(track, {
        clientWidth: { configurable: true, value: 936 },
        scrollWidth: { configurable: true, value: 1632 }
    });
    const bounds = track.getBoundingClientRect();
    let widths = [390, 390, 390, 390];

    for (const [index, slide] of [...track.children].entries())
        mock.method(slide, 'getBoundingClientRect', () => ({
            ...bounds,
            left:
                widths.slice(0, index).reduce((sum, width) => sum + width + 24, 0) -
                track.scrollLeft,
            width: widths[index]
        }));
    const positions: number[] = [];
    mock.method(track, 'scrollTo', ({ left = 0 }: ScrollToOptions) => {
        positions.push(left);
        track.scrollLeft = left;
    });
    act(() => ref.current?.scroller.refresh());

    const finish = () =>
        act(() => {
            frame?.(0);
            frame?.(200);
            frame?.(400);
        });
    assert.equal(screen.getAllByRole('button', { name: /^Slide/ }).length, 3);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    finish();

    assert.equal(track.scrollLeft, 414);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    finish();

    assert.equal(track.scrollLeft, 696);
    assert.equal(ref.current?.store.activeIndex, 2);
    assert.equal(screen.getByRole<HTMLButtonElement>('button', { name: 'Next' }).disabled, true);

    const calls = positions.length;
    act(() => {
        ref.current?.store.next(true);
        ref.current?.store.setIndex(3, true);
    });
    assert.equal(positions.length, calls);
    assert.equal(ref.current?.store.navigating, false);

    track.scrollLeft = 414;
    fireEvent.scroll(track);

    assert.equal(ref.current?.store.activeIndex, 1);

    act(() => ref.current?.store.play());
    act(() => mock.timers.tick(1000));
    finish();

    assert.equal(track.scrollLeft, 696);
    assert.equal(ref.current?.store.activeIndex, 2);

    act(() => mock.timers.tick(1000));

    assert.equal(ref.current?.store.playing, false);
    assert.equal(positions.length, calls + 3);

    widths = [280, 390, 310, 580];
    rerender(
        <Carousel ref={ref} auto indicators>
            {[0, 1, 2, 3].map(index => (
                <CarouselSlide key={index}>{index}</CarouselSlide>
            ))}
        </Carousel>
    );
    positions.length = 0;
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    finish();

    assert.ok(positions[1] > 0 && positions[1] < 696);
    assert.equal(track.scrollLeft, 0);
    assert.equal(track.querySelector('[data-carousel-clone]'), null);
    assert.equal(ref.current?.store.activeIndex, 0);

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    finish();

    assert.equal(track.scrollLeft, 696);

    const matchMedia = window.matchMedia.bind(window);
    const media = mock.method(window, 'matchMedia', (query: string) => {
        const result = matchMedia(query);
        Object.defineProperty(result, 'matches', { value: true });

        return result;
    });
    act(() => ref.current?.scroller.refresh());
    positions.length = 0;
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    assert.deepEqual(positions, [0]);
    assert.equal(ref.current?.store.navigating, false);
    unmount();
    media.mock.restore();
    request.mock.restore();
    mock.timers.reset();
});

for (const fade of [false, true])
    it(`preserves autoplay deadlines across rerenders in ${fade ? 'fade' : 'scroll'} mode`, t => {
        t.mock.timers.enable({ apis: ['setTimeout'] });
        const ref = createRef<Carousel>();
        const onChange = t.mock.fn();
        const children = ['First', 'Second', 'Third'].map(label => (
            <CarouselSlide key={label}>{label}</CarouselSlide>
        ));
        const { rerender, unmount } = render(
            <Carousel ref={ref} interval={100} fade={fade} autoplay onChange={onChange}>
                {children}
            </Carousel>
        );
        const { store } = ref.current!;
        act(() => t.mock.timers.tick(60));

        rerender(
            <Carousel ref={ref} interval={100} items={2} fade={fade} autoplay onChange={onChange}>
                {children}
            </Carousel>
        );
        act(() => t.mock.timers.tick(40));

        assert.equal(ref.current?.store, store);
        assert.equal(store.activeIndex, 1);
        assert.equal(onChange.mock.callCount(), 1);

        act(() => t.mock.timers.tick(25));
        rerender(
            <Carousel ref={ref} interval={200} fade={fade} autoplay onChange={onChange}>
                {children}
            </Carousel>
        );
        act(() => t.mock.timers.tick(175));

        assert.equal(store.activeIndex, 1);

        act(() => t.mock.timers.tick(25));

        assert.equal(store.activeIndex, 2);
        assert.equal(onChange.mock.callCount(), 2);

        unmount();
        act(() => t.mock.timers.tick(1000));

        assert.equal(onChange.mock.callCount(), 2);
    });

it('replaces mode models without losing selection or playback intent and releases old effects', t => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    t.mock.method(window, 'requestAnimationFrame', () => 123);
    const cancel = t.mock.method(window, 'cancelAnimationFrame');
    const ref = createRef<Carousel>();
    const onChange = t.mock.fn();
    const children = ['First', 'Second'].map(label => (
        <CarouselSlide key={label}>{label}</CarouselSlide>
    ));
    const { container, rerender, unmount } = render(
        <Carousel ref={ref} interval={100} autoplay onChange={onChange}>
            {children}
        </Carousel>
    );
    const track = container.querySelector('.carousel-inner') as HTMLElement;

    for (const [index, slide] of [...track.children].entries())
        Object.defineProperty(slide, 'offsetLeft', { configurable: true, value: index * 100 });

    track.style.scrollSnapType = 'x mandatory';
    const scrolling = ref.current!.store;
    fireEvent.scroll(track);

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    assert.equal(scrolling.activeIndex, 1);
    assert.equal(scrolling.playing, false);
    assert.ok(track.querySelector('[data-carousel-clone]'));

    const scrollTo = t.mock.method(track, 'scrollTo', ({ left = 0 }: ScrollToOptions) => {
        track.scrollLeft = left;
    });
    rerender(
        <Carousel ref={ref} interval={100} autoplay fade onChange={onChange}>
            {children}
        </Carousel>
    );
    const fading = ref.current!.store;

    assert.notEqual(fading, scrolling);
    assert.equal(fading.activeIndex, 1);
    assert.equal(fading.playing, false);
    assert.equal(track.querySelector('[data-carousel-clone]'), null);
    assert.equal(track.style.scrollSnapType, 'x mandatory');
    assert.ok(cancel.mock.calls.some(({ arguments: args }) => args[0] === 123));
    assert.equal(scrollTo.mock.callCount(), 0);

    act(() => {
        fading.play();
        fading.setHovering(true);
    });
    track.scrollLeft = 0;
    fireEvent.scroll(track);

    assert.equal(fading.activeIndex, 1);
    assert.equal(scrollTo.mock.callCount(), 0);

    rerender(
        <Carousel ref={ref} interval={100} autoplay onChange={onChange}>
            {children}
        </Carousel>
    );
    const restored = ref.current!.store;

    assert.notEqual(restored, fading);
    assert.equal(restored.activeIndex, 1);
    assert.equal(restored.playing, true);
    assert.equal(restored.cycling, false);
    assert.equal(track.scrollLeft, 100);
    assert.equal(onChange.mock.callCount(), 1);

    act(() => t.mock.timers.tick(1000));

    assert.equal(restored.activeIndex, 1);

    fireEvent.mouseLeave(screen.getByRole('region'));
    act(() => t.mock.timers.tick(100));

    assert.equal(restored.activeIndex, 0);
    assert.equal(onChange.mock.callCount(), 2);

    unmount();
    act(() => t.mock.timers.tick(1000));

    assert.equal(track.querySelector('[data-carousel-clone]'), null);
    assert.equal(onChange.mock.callCount(), 2);
});

it('normalizes selection once when changing mode and removing the active slide together', t => {
    const ref = createRef<Carousel>();
    const onChange = t.mock.fn();
    const children = ['First', 'Second', 'Third'].map(label => (
        <CarouselSlide key={label}>{label}</CarouselSlide>
    ));
    const { rerender } = render(
        <Carousel ref={ref} fade onChange={onChange}>
            {children}
        </Carousel>
    );
    act(() => ref.current?.store.setIndex(2, true));

    rerender(
        <Carousel ref={ref} onChange={onChange}>
            {children.slice(0, 2)}
        </Carousel>
    );
    assert.equal(ref.current?.store.activeIndex, 1);
    assert.equal(onChange.mock.callCount(), 2);
    assert.deepEqual(
        onChange.mock.calls.map(({ arguments: args }) => args[0]),
        [2, 1]
    );
});
