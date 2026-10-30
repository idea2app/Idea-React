import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Navbar } from '../source/Navbar';

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

    rerender(<Navbar />);
    assert.equal(screen.getByRole('navigation').className, 'navbar');
});
