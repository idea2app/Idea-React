import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Loading } from '../../source/Extension/Loading';

it('preserves the default translucent full-page loading overlay', () => {
    const { container } = render(<Loading />);
    const overlay = container.firstElementChild!;

    assert.equal((overlay as HTMLElement).style.opacity, '0.25');
    assert.ok(overlay.classList.contains('fixed-top'));
    assert.ok(overlay.classList.contains('h-100'));
    assert.ok(overlay.classList.contains('w-100'));
    assert.equal(screen.getByText('Loading...').parentElement, overlay);
});

it('supports a custom opacity and forwards its content and accessibility attributes', () => {
    render(
        <Loading className="custom" aria-label="Restoring state" role="status" opacity={100}>
            Restoring preferences...
        </Loading>
    );
    const overlay = screen.getByRole('status', { name: 'Restoring state' });

    assert.equal(overlay.style.opacity, '1');
    assert.ok(overlay.classList.contains('bg-black'));
    assert.ok(overlay.classList.contains('custom'));
    assert.equal(screen.getByText('Restoring preferences...').parentElement, overlay);
});
