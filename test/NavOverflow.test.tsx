import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { NavLink } from '../source/Base/Nav';
import { NavOverflow } from '../source/Base/NavOverflow';

it('renders safely during server-side rendering', () => {
    const markup = renderToStaticMarkup(
        <NavOverflow id="server-links" aria-label="Server navigation">
            <NavLink href="/home">Home</NavLink>
        </NavOverflow>
    );
    assert.match(markup, /aria-label="Server navigation"/);
    assert.match(markup, /Server navigation/);
    assert.match(markup, /href="\/home"/);
    assert.match(markup, /nav-overflow-item flex-shrink-0 position-absolute invisible/);
    assert.doesNotMatch(markup, /nav-overflow-initialized/);
});

it('reveals initialized navigation and does not reserve a toggle when every link fits', () => {
    const { container } = render(
        <NavOverflow id="fitting-links" variant="pills">
            <NavLink href="/one">One</NavLink>
            <NavLink href="/two">Two</NavLink>
        </NavOverflow>
    );
    const root = container.firstElementChild as HTMLElement;
    const navigation = screen.getByRole('navigation');
    const links = [...navigation.querySelectorAll<HTMLAnchorElement>(':scope > a')];
    const toggle = root.querySelector<HTMLButtonElement>('[data-overflow-toggle]')!;

    Object.defineProperty(root, 'clientWidth', { configurable: true, value: 150 });
    for (const link of links)
        Object.defineProperty(link, 'offsetWidth', { configurable: true, value: 70 });
    Object.defineProperty(toggle, 'offsetWidth', { configurable: true, value: 50 });

    fireEvent(window, new Event('resize'));

    assert.ok(root.classList.contains('nav-overflow-initialized'));
    assert.equal(toggle.closest('.nav'), navigation);
    assert.ok(navigation.classList.contains('nav-pills'));
    assert.equal(navigation.classList.contains('overflow-hidden'), false);
    assert.equal(
        links.every(link => !link.hasAttribute('aria-hidden')),
        true
    );
    assert.ok(toggle.parentElement?.classList.contains('position-absolute'));
    assert.ok(toggle.parentElement?.classList.contains('invisible'));
});

it('moves overflowing navigation links into an accessible menu and restores focus on Escape', () => {
    const { container } = render(
        <NavOverflow id="primary-links" variant="tabs" minimumVisibleItems={1}>
            <NavLink href="/home" className="active">
                Home
            </NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/support">Support</NavLink>
        </NavOverflow>
    );
    const root = container.firstElementChild as HTMLElement;
    const navigation = screen.getByRole('navigation');

    const links = [...navigation.children].filter(
        child => !child.classList.contains('nav-overflow-item')
    ) as HTMLElement[];
    const toggle = root.querySelector<HTMLButtonElement>(
        '[data-overflow-toggle]'
    ) as HTMLButtonElement;

    Object.defineProperty(root, 'clientWidth', { configurable: true, value: 150 });
    for (const link of links)
        Object.defineProperty(link, 'offsetWidth', { configurable: true, value: 70 });
    Object.defineProperty(toggle, 'offsetWidth', { configurable: true, value: 50 });

    fireEvent(window, new Event('resize'));

    assert.equal(screen.getByRole('button', { name: 'More' }), toggle);
    assert.equal(links[0].getAttribute('aria-hidden'), null);
    assert.equal(links[1].getAttribute('aria-hidden'), 'true');
    assert.equal(links[2].getAttribute('aria-hidden'), 'true');
    assert.equal(root.querySelector('[role="menu"]')?.hasAttribute('hidden'), true);

    fireEvent.click(toggle);

    assert.equal(toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(root.querySelector('[role="menu"]')?.hasAttribute('hidden'), false);
    assert.equal(
        screen.getByRole('menuitem', { name: 'Products' }).getAttribute('href'),
        '/products'
    );
    fireEvent.keyDown(root, { key: 'Escape' });

    assert.equal(toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(document.activeElement, toggle);
});

it('keeps priority items visible and supports custom toggle labels and icon placement', () => {
    const { container } = render(
        <NavOverflow
            id="secondary-links"
            moreText="All links"
            iconPlacement="end"
            minimumVisibleItems={1}
        >
            <NavLink href="/home" className="nav-overflow-keep">
                Home
            </NavLink>
            <NavLink href="/about">About</NavLink>
        </NavOverflow>
    );
    const root = container.firstElementChild as HTMLElement;
    const navigation = screen.getByRole('navigation');

    const [home, about] = [...navigation.children] as HTMLElement[];
    const toggle = root.querySelector<HTMLButtonElement>(
        '[data-overflow-toggle]'
    ) as HTMLButtonElement;

    Object.defineProperty(root, 'clientWidth', { configurable: true, value: 75 });
    Object.defineProperty(home, 'offsetWidth', { configurable: true, value: 60 });
    Object.defineProperty(about, 'offsetWidth', { configurable: true, value: 60 });
    Object.defineProperty(toggle, 'offsetWidth', { configurable: true, value: 55 });

    fireEvent(window, new Event('resize'));

    assert.equal(screen.getByRole('button', { name: 'All links' }), toggle);
    assert.equal(home.getAttribute('aria-hidden'), null);
    assert.equal(about.getAttribute('aria-hidden'), 'true');
    assert.equal(root.querySelector('[role="menu"]')?.id, 'secondary-links-menu');
});

it('collapses all non-priority links below a breakpoint and restores them on resize', () => {
    const { container } = render(
        <NavOverflow
            id="compact-links"
            collapseBelow={150}
            moreText={false}
            aria-label="Compact links"
        >
            <NavLink href="/one">One</NavLink>
            <NavLink href="/two">Two</NavLink>
        </NavOverflow>
    );
    const root = container.firstElementChild as HTMLElement;
    const links = [
        ...screen.getByRole('navigation', { name: 'Compact links' }).querySelectorAll(':scope > a')
    ] as HTMLElement[];
    const toggle = root.querySelector<HTMLButtonElement>(
        '[data-overflow-toggle]'
    ) as HTMLButtonElement;

    Object.defineProperty(root, 'clientWidth', { configurable: true, value: 100 });
    for (const link of links)
        Object.defineProperty(link, 'offsetWidth', { configurable: true, value: 30 });
    Object.defineProperty(toggle, 'offsetWidth', { configurable: true, value: 50 });

    fireEvent(window, new Event('resize'));

    assert.equal(screen.getByRole('button', { name: 'More' }), toggle);
    assert.equal(
        links.every(link => link.getAttribute('aria-hidden') === 'true'),
        true
    );
    Object.defineProperty(root, 'clientWidth', { configurable: true, value: 200 });
    fireEvent(window, new Event('resize'));

    assert.equal(
        links.every(link => link.getAttribute('aria-hidden') === null),
        true
    );
    assert.equal(toggle.hasAttribute('aria-label'), true);
});
