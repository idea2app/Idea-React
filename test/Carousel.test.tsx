import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, lazy, Suspense } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Carousel, CarouselSlide } from '../source/Carousel';

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

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    act(() => frame?.(window.performance.now() + 500));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    const clone = track.querySelector<HTMLElement>('[data-carousel-clone]');

    assert.equal(clone?.inert, true);
    assert.equal(clone?.getAttribute('aria-hidden'), 'true');
    assert.equal(clone?.querySelector('[id]'), null);
    assert.equal(clone?.id, '');
    assert.equal(screen.getAllByRole('button', { name: /^Slide/ }).length, 2);
    assert.equal(scrollTo.mock.calls.at(-1)?.arguments[0].left, 100);

    act(() => frame?.(window.performance.now() + 500));

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

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    assert.ok(track.firstElementChild?.hasAttribute('data-carousel-clone'));
    assert.equal(track.scrollLeft, 100);
    assert.equal(screen.getAllByRole('button', { name: /^Slide/ }).length, 2);

    act(() => frame?.(window.performance.now() + 500));

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
