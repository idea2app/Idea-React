import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Nav, NavItem, NavLink } from '../source/Nav';

it('uses Bootstrap 6 nav variant, orientation, and fill classes', () => {
    const { rerender } = render(
        <Nav aria-label="Sections" variant="pills" className="custom" vertical fill justified />
    );

    assert.equal(
        screen.getByRole('navigation', { name: 'Sections' }).className,
        'nav nav-pills nav-pills-vertical nav-fill nav-justified custom'
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
