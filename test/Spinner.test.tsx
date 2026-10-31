import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Spinner } from '../source/Spinner';

it('uses Bootstrap 6 animation, size, and theme classes', () => {
    render(<Spinner animation="grow" size="sm" theme="primary" role="status" />);

    assert.equal(screen.getByRole('status').className, 'spinner-grow spinner-sm theme-primary');
});
