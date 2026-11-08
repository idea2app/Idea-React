import assert from 'node:assert/strict';
import { it, mock } from 'node:test';
import { setTimeout } from 'node:timers/promises';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Alert, AlertHeading, AlertLink } from '../source/Base/Alert';

it('renders themed alerts with links and additional content and dismisses instantly', () => {
    const order: string[] = [];
    const onClose = () => order.push('close');
    const onClosed = () => {
        assert.equal(screen.queryByRole('alert'), null);
        order.push('closed');
    };
    render(
        <Alert
            theme="success"
            className="custom"
            dismissible
            instant
            onClose={onClose}
            onClosed={onClosed}
        >
            <AlertHeading>Saved</AlertHeading>
            <p>
                Your changes are saved. <AlertLink href="/changes">View changes</AlertLink>
            </p>
        </Alert>
    );
    assert.equal(screen.getByRole('alert').className, 'alert theme-success alert-instant custom');
    assert.equal(screen.getByRole('heading').className, 'alert-heading');
    assert.equal(screen.getByRole('link').className, 'alert-link');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    assert.equal(screen.queryByRole('alert'), null);
    assert.deepEqual(order, ['close', 'closed']);
});

it('waits for the alert transition, ignores child transitions and closes only once', () => {
    const onClosed = mock.fn();
    render(
        <Alert style={{ transitionDuration: '1s' }} dismissible onClosed={onClosed}>
            <p>Notice</p>
        </Alert>
    );
    const alert = screen.getByRole('alert');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    assert.match(alert.className, /hiding/);

    fireEvent.transitionEnd(screen.getByText('Notice'));

    assert.equal(onClosed.mock.callCount(), 0);

    fireEvent.transitionEnd(alert);

    assert.equal(screen.queryByRole('alert'), null);
    assert.equal(onClosed.mock.callCount(), 1);
});

it('completes zero-duration dismissal without requiring a transition event', async () => {
    render(<Alert dismissible>Notice</Alert>);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await act(() => setTimeout(10));

    assert.equal(screen.queryByRole('alert'), null);
});
