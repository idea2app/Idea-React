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
