import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { PageNav } from '../../source/Extension/PageNav';

it('builds a scoped table of contents from headings within the root selector', () => {
    render(
        <>
            <h1 id="outside">Outside title</h1>
            <article id="article">
                <h2 id="first">First section</h2>
                <h3 id="detail">Detail</h3>
                <h4 id="deep">Deep heading</h4>
            </article>
            <PageNav rootSelector="#article" minDepth={2} depth={3} aria-label="On this page" />
        </>
    );
    const nav = screen.getByRole('navigation', { name: 'On this page' });
    const links = [...nav.querySelectorAll('a')];

    assert.deepEqual(
        links.map(({ textContent }) => textContent),
        ['First section', 'Detail']
    );
    assert.deepEqual(
        links.map(link => link.getAttribute('href')),
        ['#first', '#detail']
    );
    assert.equal(links[0].style.paddingInlineStart, '0.75rem');
    assert.equal(links[1].style.paddingInlineStart, '1.75rem');
    assert.ok(links.every(link => link.classList.contains('text-wrap')));
    assert.ok(links.every(link => link.classList.contains('justify-content-start')));
    assert.ok(links.every(link => link.classList.contains('min-w-0')));
});

it('tracks document-relative heading positions on mount, scroll and resize', t => {
    let scrollY = 250;
    let secondTop = 500;
    t.mock.getter(window, 'scrollY', () => scrollY);

    const headings = render(
        <article id="positions">
            <h2 id="position-first">First</h2>
            <h2 id="position-second">Second</h2>
        </article>
    );
    const first = screen.getByRole('heading', { name: 'First' });
    const second = screen.getByRole('heading', { name: 'Second' });

    t.mock.method(first, 'getBoundingClientRect', () => new window.DOMRect(0, 100 - scrollY, 0, 0));
    t.mock.method(
        second,
        'getBoundingClientRect',
        () => new window.DOMRect(0, secondTop - scrollY, 0, 0)
    );
    const ref = createRef<PageNav>();
    const navigation = render(<PageNav ref={ref} rootSelector="#positions" />);

    assert.deepEqual(
        ref.current?.list.map(({ top }) => top),
        [100, 500]
    );
    assert.equal(
        screen.getByRole('link', { name: 'First' }).getAttribute('aria-current'),
        'location'
    );

    scrollY = 600;
    fireEvent.scroll(window);

    assert.equal(
        screen.getByRole('link', { name: 'Second' }).getAttribute('aria-current'),
        'location'
    );

    secondTop = 800;
    fireEvent.resize(window);

    assert.deepEqual(
        ref.current?.list.map(({ top }) => top),
        [100, 800]
    );
    assert.equal(
        screen.getByRole('link', { name: 'First' }).getAttribute('aria-current'),
        'location'
    );

    scrollY = 0;
    fireEvent.scroll(window);

    assert.equal(ref.current?.currentActiveId, undefined);

    navigation.unmount();
    headings.unmount();
});

it('releases scroll and resize listeners when unmounted', t => {
    const remove = t.mock.method(window, 'removeEventListener');
    const ref = createRef<PageNav>();
    const { unmount } = render(<PageNav ref={ref} />);
    const listener = ref.current!.updateScrollY;

    unmount();

    for (const type of ['scroll', 'resize'])
        assert.ok(
            remove.mock.calls.some(
                ({ arguments: args }) => args[0] === type && args[1] === listener
            )
        );
});

it('collects document-wide headings and assigns missing ids by default', () => {
    render(
        <>
            <h2>Anonymous section</h2>
            <PageNav aria-label="Full outline" />
        </>
    );
    const nav = screen.getByRole('navigation', { name: 'Full outline' });
    const links = [...nav.querySelectorAll('a')];

    assert.ok(links.length >= 1);

    for (const link of links) assert.match(link.getAttribute('href')!, /^#.+/);
});
