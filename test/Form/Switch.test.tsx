import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { FormSwitch } from '../../source/Form';

it('renders a labeled switch with native input props', () => {
    render(
        <FormSwitch inputProps={{ name: 'notifications', defaultChecked: true }}>
            Notifications
        </FormSwitch>
    );
    const input = screen.getByLabelText('Notifications') as HTMLInputElement;

    assert.equal(input.checked, true);
    assert.equal(input.name, 'notifications');
    assert.equal(input.closest('label')?.className, 'switch');
});

it('supports themed large switches with custom width and disabled validation', () => {
    render(
        <FormSwitch
            size="lg"
            theme="success"
            width="2.75rem"
            indicatorWidth="1.5rem"
            validation="invalid"
            inputProps={{ disabled: true }}
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
