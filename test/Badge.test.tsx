import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Badge } from '../source/Badge';

it('maps solid, subtle, outline, theme, and pill classes without leaking props', () => {
    const { rerender } = render(
        <Badge theme="warning" variant="subtle" pill>
            Alpha
        </Badge>
    );
    assert.equal(
        screen.getByText('Alpha').className,
        'badge badge-subtle theme-warning rounded-pill'
    );
    assert.equal(screen.getByText('Alpha').hasAttribute('pill'), false);

    rerender(<Badge variant="outline">Alpha</Badge>);
    assert.equal(screen.getByText('Alpha').className, 'badge badge-outline');

    rerender(<Badge>Alpha</Badge>);
    assert.equal(screen.getByText('Alpha').className, 'badge');
});

it('supports a linked announcement with the same badge variants', () => {
    render(
        <Badge href="/release" variant="subtle">
            New release
        </Badge>
    );
    assert.equal(
        screen.getByRole('link', { name: 'New release' }).getAttribute('href'),
        '/release'
    );
});
