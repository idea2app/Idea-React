import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Collapse, CollapseToggle } from '../source/Base/Collapse';
import { Navbar, NavbarBrand, NavbarNav, NavbarText, NavbarToggler } from '../source/Base/Navbar';

it('supports translucent color modes and navigation variants', () => {
    render(
        <Navbar theme="dark" translucent>
            <NavbarNav variant="pills">Links</NavbarNav>
        </Navbar>
    );
    assert.equal(screen.getByRole('navigation').className, 'navbar navbar-translucent');
    assert.equal(screen.getByRole('navigation').getAttribute('data-bs-theme'), 'dark');
    assert.equal(screen.getByText('Links').className, 'navbar-nav nav nav-pills');
});

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
            <NavbarBrand as="span" className="mb-0 h1">
                Navbar
            </NavbarBrand>
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
    assert.equal(screen.getByText('Navbar').className, 'navbar-brand mb-0 h1');
    assert.equal(
        screen.getByRole('button', { name: 'Toggle navigation' }).className,
        'btn-icon navbar-toggler'
    );
    assert.equal(
        screen.getByRole('button', { name: 'Toggle navigation' }).getAttribute('type'),
        'button'
    );
    assert.equal(
        screen.getByRole('button', { name: 'Toggle navigation' }).getAttribute('aria-expanded'),
        'true'
    );
    assert.equal(screen.getByRole('list').className, 'navbar-nav');
    assert.equal(screen.getByText('Signed in as Ada').className, 'navbar-text');
});

it('toggles a collapse target with the navbar toggler variant', () => {
    render(
        <>
            <CollapseToggle
                target="#navbar-collapse"
                variant={false}
                aria-label="Toggle navigation"
                navbarToggler
            />
            <Collapse id="navbar-collapse" />
        </>
    );
    const toggler = screen.getByRole('button', { name: 'Toggle navigation' });
    const collapse = document.getElementById('navbar-collapse');

    assert.equal(toggler.className, 'btn-icon navbar-toggler');
    assert.equal(toggler.getAttribute('type'), 'button');
    assert.equal(toggler.getAttribute('aria-controls'), 'navbar-collapse');
    assert.equal(toggler.getAttribute('aria-expanded'), 'false');
    assert.equal(
        toggler.querySelector('.navbar-toggler-icon')?.getAttribute('aria-hidden'),
        'true'
    );
    fireEvent.click(toggler);

    assert.equal(collapse?.classList.contains('show'), true);
    assert.equal(toggler.getAttribute('aria-expanded'), 'true');
});

it('forwards native dialog commands from the navbar toggler', () => {
    render(<NavbarToggler commandfor="navigation-drawer" command="show-modal" />);

    const toggler = screen.getByRole('button', { name: 'Toggle navigation' });

    assert.equal(toggler.getAttribute('commandfor'), 'navigation-drawer');
    assert.equal(toggler.getAttribute('command'), 'show-modal');
});
