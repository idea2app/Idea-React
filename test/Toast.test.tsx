import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Toast, ToastContainer } from '../source/Toast';

it('renders toast containers in static or fixed positions', () => {
    const { rerender } = render(<ToastContainer />);

    assert.equal(
        document.querySelector('.toast-container')?.className,
        'toast-container position-fixed p-3 top-0 end-0'
    );
    rerender(<ToastContainer position="static" />);

    assert.equal(
        document.querySelector('.toast-container')?.className,
        'toast-container position-static'
    );
});

it('renders and closes a themed Bootstrap 6 toast', async () => {
    const toast = new Toast();
    const closed = toast.open({
        title: 'Saved',
        body: 'Your changes are saved.',
        theme: 'success',
        delay: 0
    });
    render(<toast.Component position="bottom-center" />);

    assert.equal(screen.getByRole('status').className, 'toast show theme-success');
    assert.equal(screen.getByText('Your changes are saved.').className, 'toast-body');
    assert.equal(document.querySelector('.toast-container')?.getAttribute('aria-atomic'), 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    assert.ok((await closed).closedAt);
    assert.equal(screen.queryByRole('status'), null);
});
