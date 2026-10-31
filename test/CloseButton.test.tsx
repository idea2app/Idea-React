import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { CloseButton } from '../source/CloseButton';

it('renders a Bootstrap 6 close button', () => {
    render(<CloseButton className="custom" onClick={() => undefined} />);

    const button = screen.getByRole('button', { name: 'Close' });

    assert.equal(button.className, 'btn-close custom');
    assert.equal(button.getAttribute('type'), 'button');
});

it('supports dismissal attributes and custom labels', () => {
    render(<CloseButton dismiss="dialog" aria-label="Dismiss dialog" />);

    const button = screen.getByRole('button', { name: 'Dismiss dialog' });

    assert.equal(button.getAttribute('data-bs-dismiss'), 'dialog');
});
