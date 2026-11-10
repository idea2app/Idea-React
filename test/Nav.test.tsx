import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Nav, NavItem, NavLink } from '../source/Base/Nav';

it('preserves native disabled behavior for button navigation links', () => {
    const clicked = mock.fn();
    render(
        <NavLink as="button" type="button" disabled onClick={clicked}>
            Disabled button
        </NavLink>
    );
    const button = screen.getByRole('button', { name: 'Disabled button' });

    assert.equal(button.hasAttribute('disabled'), true);

    fireEvent.click(button);

    assert.equal(clicked.mock.callCount(), 0);
});

it('supports card header tabs and derives the current page from active links', () => {
    render(
        <Nav variant="tabs" cardHeader>
            <NavLink href="/page" active>
                Current
            </NavLink>
        </Nav>
    );
    const link = screen.getByRole('link', { name: 'Current' });

    assert.equal(link.className, 'nav-link active');
    assert.equal(link.getAttribute('aria-current'), 'page');
    assert.equal(link.parentElement?.className, 'nav nav-tabs card-header-tabs');
});

it('uses Bootstrap 6 nav variant, orientation, and fill classes', () => {
    const { rerender } = render(
        <Nav
            className="custom"
            variant="pills"
            vertical
            fill
            justified
            flush
            aria-label="Sections"
        />
    );
    assert.equal(
        screen.getByRole('navigation', { name: 'Sections' }).className,
        'nav nav-pills nav-pills-vertical nav-fill nav-justified nav-flush custom'
    );
    rerender(<Nav aria-label="Sections" variant="tabs" vertical />);

    assert.equal(
        screen.getByRole('navigation', { name: 'Sections' }).className,
        'nav nav-tabs flex-column'
    );
});

it('renders navbar-style items and links, including disabled links', () => {
    const onClick = mock.fn();
    render(
        <ul className="navbar-nav">
            <NavItem>
                <NavLink href="/" className="active" aria-current="page">
                    Home
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/disabled" disabled onClick={onClick}>
                    Disabled
                </NavLink>
            </NavItem>
        </ul>
    );
    for (const item of screen.getAllByRole('listitem')) assert.equal(item.className, 'nav-item');
    assert.equal(screen.getByRole('link', { name: 'Home' }).className, 'nav-link active');

    const disabled = screen.getByText('Disabled');

    assert.equal(disabled.getAttribute('href'), null);
    assert.equal(disabled.getAttribute('aria-disabled'), 'true');
    assert.equal(disabled.className, 'nav-link disabled pe-none');

    fireEvent.click(disabled);

    assert.equal(onClick.mock.callCount(), 0);
});
