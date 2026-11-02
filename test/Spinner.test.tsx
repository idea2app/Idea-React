import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Spinner, SpinnerIcon } from '../source/Spinner';

it('uses Bootstrap 6 animation, size, and theme classes', () => {
    render(<Spinner animation="grow" size="sm" theme="primary" role="status" />);

    assert.equal(screen.getByRole('status').className, 'spinner-grow spinner-sm theme-primary');
});

it('defaults to an accessible status and supports rotating icon spinners', () => {
    const { rerender } = render(<Spinner aria-label="Loading" />);

    assert.equal(screen.getByRole('status', { name: 'Loading' }).className, 'spinner-border');

    rerender(<SpinnerIcon name="arrow-repeat" role="status" aria-label="Loading" />);

    assert.equal(
        screen.getByRole('status', { name: 'Loading' }).className,
        'bi-arrow-repeat spinner-rotate'
    );
});
