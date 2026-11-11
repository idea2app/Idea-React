import assert from 'node:assert/strict';
import { it } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Toast, ToastContainer, ToastItem } from '../../source/Base/Toast';

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

it('renders translucent and instant toast variants without leaking style props', () => {
    const { container } = render(
        <ToastItem show={false} translucent instant>
            Hidden
        </ToastItem>
    );
    assert.equal(container.firstElementChild?.className, 'toast toast-translucent toast-instant');
    assert.equal(container.firstElementChild?.hasAttribute('translucent'), false);
});

it('automatically closes caller-identified messages and resolves their lifetime promise', async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] });

    const toast = new Toast();
    const closed = toast.open({
        id: 'notice',
        body: 'Saved',
        delay: 100,
        instant: true,
        translucent: true
    });
    render(<toast.Component />);

    assert.equal(
        screen.getByRole('status').className,
        'toast show toast-translucent toast-instant'
    );
    assert.equal(toast.messages[0].id, 'notice');

    act(() => t.mock.timers.tick(100));

    assert.equal((await closed).id, 'notice');
    assert.equal(screen.queryByRole('status'), null);
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

it('replaces a duplicate message id without leaving an unresolved toast', async () => {
    const toast = new Toast();
    const first = toast.open({ id: 'notice', body: 'First', delay: 0 });
    const second = toast.open({ id: 'notice', body: 'Second', delay: 0, role: 'alert' });
    render(<toast.Component />);

    assert.ok((await first).closedAt);
    assert.equal(toast.messages.length, 1);
    assert.equal(screen.getByRole('alert').textContent?.includes('Second'), true);

    act(() => toast.close('notice'));

    assert.ok((await second).closedAt);
    assert.equal(toast.messages.length, 0);
});
