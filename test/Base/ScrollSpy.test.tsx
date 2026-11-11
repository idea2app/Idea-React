import assert from 'node:assert/strict';
import { afterEach, beforeEach, it, mock } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Nav, NavLink } from '../../source/Base/Nav';
import { ScrollSpy } from '../../source/Base/ScrollSpy';

class Observer {
    static instances: Observer[] = [];

    observe = mock.fn();
    disconnect = mock.fn();

    constructor(
        public callback: IntersectionObserverCallback,
        public options: IntersectionObserverInit
    ) {
        Observer.instances.push(this);
    }

    emit = (target: Element, isIntersecting: boolean) =>
        act(() =>
            this.callback(
                [{ target, isIntersecting } as IntersectionObserverEntry],
                this as unknown as IntersectionObserver
            )
        );
}

const originalObserver = window.IntersectionObserver;

beforeEach(() => {
    Observer.instances = [];
    window.IntersectionObserver = Observer as unknown as typeof IntersectionObserver;
});
afterEach(() => {
    window.IntersectionObserver = originalObserver;
});

it('renders a keyboard-focusable scroll root during server-side rendering', () => {
    const markup = renderToStaticMarkup(
        <ScrollSpy aria-label="Server scroll content">
            <section id="server-section">Content</section>
        </ScrollSpy>
    );
    assert.match(markup, /tabindex="0"/);
    assert.match(markup, /Content/);
});

it('activates matching navigation links as sections cross the scroll activation line', () => {
    const onActiveChange = mock.fn();

    const { container } = render(
        <>
            <nav id="spy-links" aria-label="Sections">
                <a href="#first">First</a>
                <a href="#second">Second</a>
            </nav>
            <ScrollSpy target="#spy-links" topMargin="12px" onActiveChange={onActiveChange}>
                <section id="first">First section</section>
                <section id="second">Second section</section>
            </ScrollSpy>
        </>
    );
    const root = container.querySelector('.scrollspy') as HTMLElement;
    const first = screen.getByText('First section');
    const second = screen.getByText('Second section');

    Object.defineProperty(root, 'clientHeight', { configurable: true, value: 100 });
    Object.defineProperty(root, 'scrollHeight', { configurable: true, value: 400 });
    Object.defineProperty(root, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ top: 0, bottom: 100, height: 100, left: 0, right: 100, width: 100 })
    });
    Object.defineProperty(first, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ top: 20, bottom: 40, height: 20, left: 0, right: 100, width: 100 })
    });
    Object.defineProperty(second, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ top: 120, bottom: 140, height: 20, left: 0, right: 100, width: 100 })
    });
    Observer.instances[0].emit(first, true);

    assert.equal(screen.getByRole('link', { name: 'First' }).className, 'active');
    assert.equal(
        screen.getByRole('link', { name: 'First' }).getAttribute('aria-current'),
        'location'
    );
    Object.defineProperty(first, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ top: -80, bottom: -60, height: 20, left: 0, right: 100, width: 100 })
    });
    Object.defineProperty(second, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ top: 0, bottom: 20, height: 20, left: 0, right: 100, width: 100 })
    });
    Observer.instances[0].emit(second, true);

    assert.equal(screen.getByRole('link', { name: 'Second' }).className, 'active');
    assert.equal(onActiveChange.mock.callCount(), 2);
});

it('refreshes links after content changes and exposes keyboard focus for its scroll root', () => {
    const { rerender, container } = render(
        <ScrollSpy topMargin="0px">
            <nav aria-label="Sections">
                <a href="#only">Only</a>
            </nav>
            <section id="only">Only section</section>
        </ScrollSpy>
    );
    const root = container.firstElementChild as HTMLElement;

    assert.equal(root.tabIndex, 0);
    assert.equal(screen.getByRole('link', { name: 'Only' }).className, 'active');

    rerender(
        <ScrollSpy topMargin="0px">
            <nav aria-label="Sections">
                <a href="#only">Only</a>
                <a href="#later">Later</a>
            </nav>
            <section id="only">Only section</section>
            <section id="later">Later section</section>
        </ScrollSpy>
    );
    assert.ok(screen.getByRole('link', { name: 'Later' }));
});

it('keeps parent navigation links active for a selected nested section', () => {
    render(
        <>
            <Nav id="nested-links" aria-label="Nested links">
                <NavLink href="#parent-section">Parent</NavLink>
                <Nav aria-label="Child links">
                    <NavLink href="#child-section">Child</NavLink>
                </Nav>
            </Nav>
            <ScrollSpy target="#nested-links">
                <section id="parent-section">Parent content</section>
                <section id="child-section">Child content</section>
            </ScrollSpy>
        </>
    );
    Observer.instances[0].emit(screen.getByText('Child content'), true);

    assert.equal(screen.getByRole('link', { name: 'Parent' }).className, 'nav-link active');
    assert.equal(screen.getByRole('link', { name: 'Child' }).className, 'nav-link active');
});

it('smooth-scrolls and focuses a matched section when a link is activated', () => {
    const { container } = render(
        <>
            <nav id="smooth-links">
                <a href="#smooth-section">Jump to section</a>
            </nav>
            <ScrollSpy target="#smooth-links" smoothScroll>
                <section id="smooth-section">Smooth section</section>
            </ScrollSpy>
        </>
    );
    const root = container.querySelector('.scrollspy') as HTMLElement;
    const section = screen.getByText('Smooth section');
    const scrollTo = mock.fn();
    const focus = mock.fn(section.focus.bind(section));

    Object.defineProperty(root, 'scrollTo', { configurable: true, value: scrollTo });
    Object.defineProperty(section, 'focus', { configurable: true, value: focus });

    fireEvent.click(screen.getByRole('link', { name: 'Jump to section' }));

    assert.equal(scrollTo.mock.callCount(), 1);
    assert.equal(focus.mock.callCount(), 1);
    assert.equal(document.activeElement, section);
    assert.equal(section.hasAttribute('tabindex'), false);
    assert.equal(window.location.hash, '#smooth-section');

    window.history.replaceState(null, '', '/');
});

it('passes raw root margins and thresholds to IntersectionObserver and disconnects on cleanup', () => {
    const { unmount } = render(
        <ScrollSpy rootMargin="0px 0px -40%" topMargin="96px" threshold={[0, 0.5, 1]}>
            <a href="#configured-section">Configured section</a>
            <section id="configured-section">Observed content</section>
        </ScrollSpy>
    );
    const [observer, bottom] = Observer.instances;

    assert.equal(observer.options.rootMargin, '0px 0px -40%');
    assert.deepEqual(observer.options.threshold, [0, 0.5, 1]);
    assert.equal(observer.observe.mock.callCount(), 1);

    unmount();

    assert.equal(observer.disconnect.mock.callCount(), 1);
    assert.equal(bottom.disconnect.mock.callCount(), 1);
    observer.emit(document.body, true);
});

it('derives pixel margins on resize and shows the same activation line in its debug overlay', () => {
    const { container, unmount } = render(
        <ScrollSpy topMargin="40px" debug>
            <a href="#debug-section">Debug section</a>
            <section id="debug-section">Debug content</section>
        </ScrollSpy>
    );
    const root = container.firstElementChild as HTMLElement;

    Object.defineProperty(root, 'clientHeight', { configurable: true, value: 200 });
    Object.defineProperty(root, 'scrollHeight', { configurable: true, value: 400 });

    fireEvent.resize(window);

    const observer = Observer.instances.at(-2) as Observer;
    const bottom = Observer.instances.at(-1) as Observer;
    assert.equal(observer.options.rootMargin, '0px 0px -80% 0px');

    const line = document.querySelector<HTMLElement>('[data-scrollspy-line]');
    assert.equal(line?.style.top, '40px');
    assert.equal(
        document.querySelector('[data-scrollspy-debug]')?.getAttribute('aria-hidden'),
        'true'
    );
    bottom.emit(root.lastElementChild as Element, true);

    assert.equal(
        document.querySelector('[data-scrollspy-bottom]')?.getAttribute('data-scrollspy-bottom'),
        'reached'
    );
    unmount();

    assert.equal(document.querySelector('[data-scrollspy-debug]'), null);
});
