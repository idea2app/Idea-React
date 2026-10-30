import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Nav } from '../source/Nav';

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
