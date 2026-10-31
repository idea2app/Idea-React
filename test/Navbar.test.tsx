import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Navbar, NavbarBrand, NavbarNav, NavbarText, NavbarToggler } from '../source/Navbar';

it('uses official responsive expansion classes on a labelled navigation landmark', () => {
    const { rerender } = render(
        <Navbar expand="lg" aria-label="Primary">
            <a href="/">Home</a>
        </Navbar>
    );
    assert.equal(
        screen.getByRole('navigation', { name: 'Primary' }).className,
        'navbar lg:navbar-expand'
    );

    rerender(<Navbar className="custom" expand />);
    assert.equal(screen.getByRole('navigation').className, 'navbar navbar-expand custom');

    rerender(<Navbar theme="dark" />);
    assert.equal(screen.getByRole('navigation').dataset.bsTheme, 'dark');

    rerender(<Navbar />);
    assert.equal(screen.getByRole('navigation').className, 'navbar');
});

it('renders brand, navigation, text, and toggler sub-components', () => {
    render(
        <Navbar aria-label="Primary">
            <NavbarBrand href="/">Idea React</NavbarBrand>
            <NavbarToggler expanded />
            <NavbarNav>
                <li className="nav-item">
                    <a className="nav-link" href="/">
                        Home
                    </a>
                </li>
            </NavbarNav>
            <NavbarText>Signed in as Ada</NavbarText>
        </Navbar>
    );

    assert.equal(screen.getByRole('link', { name: 'Idea React' }).className, 'navbar-brand');
    assert.equal(
        screen.getByRole('button', { name: 'Toggle navigation' }).className,
        'btn-icon navbar-toggler'
    );
    assert.equal(
        screen.getByRole('button', { name: 'Toggle navigation' }).getAttribute('aria-expanded'),
        'true'
    );
    assert.equal(screen.getByRole('list').className, 'navbar-nav');
    assert.equal(screen.getByText('Signed in as Ada').className, 'navbar-text');
});
