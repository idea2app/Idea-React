import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { FormSwitch } from '../../source/Form';

it('renders a labeled switch with native input attributes', () => {
    render(
        <FormSwitch
            id="notifications-wrapper"
            inputId="notifications"
            name="notifications"
            aria-describedby="hint"
            defaultChecked
        >
            Notifications
        </FormSwitch>
    );
    const input = screen.getByLabelText('Notifications') as HTMLInputElement;

    assert.equal(input.checked, true);
    assert.equal(input.id, 'notifications');
    assert.equal(input.name, 'notifications');
    assert.equal(input.getAttribute('aria-describedby'), 'hint');
    assert.equal(input.hasAttribute('name'), true);
    assert.equal(input.closest('label')?.className, 'switch');
    assert.equal(input.closest('label')?.hasAttribute('name'), false);
    assert.equal(input.closest('label')?.id, 'notifications-wrapper');
});

it('forwards standard input events and attributes to the checkbox', () => {
    const onKeyDown = mock.fn();
    render(
        <FormSwitch title="Toggle notifications" onKeyDown={onKeyDown}>
            Notifications
        </FormSwitch>
    );
    const input = screen.getByLabelText('Notifications');

    assert.equal(input.getAttribute('title'), 'Toggle notifications');
    assert.equal(input.parentElement?.hasAttribute('title'), false);

    fireEvent.keyDown(input, { key: ' ' });

    assert.equal(onKeyDown.mock.callCount(), 1);
});

it('supports themed large switches with custom width and disabled validation', () => {
    render(
        <FormSwitch
            size="lg"
            theme="success"
            width="2.75rem"
            indicatorWidth="1.5rem"
            validation="invalid"
            disabled
        >
            Disabled
        </FormSwitch>
    );
    const input = screen.getByRole('switch');

    assert.equal(input.hasAttribute('disabled'), true);
    assert.equal(input.getAttribute('aria-invalid'), 'true');
    assert.equal(input.parentElement?.className, 'switch switch-lg theme-success is-invalid');
    assert.equal(input.parentElement?.style.getPropertyValue('--bs-switch-width'), '2.75rem');
});
