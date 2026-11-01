import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';

import { FormControl, FormField, FormLabel, PasswordStrength } from '../source/Form';

it('uses Bootstrap strength scoring and disposes the plugin instance', async () => {
    const { default: Strength } = await import('bootstrap/js/src/strength.js');
    const ref = createRef<HTMLDivElement>();
    const { unmount } = render(
        <FormField>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormControl id="password" type="password" />
            <PasswordStrength ref={ref} messages={{ weak: 'Needs work' }} />
        </FormField>
    );
    const input = screen.getByLabelText('Password');
    const meter = screen.getByRole('meter');

    assert.equal(ref.current, meter);

    await waitFor(() => assert.ok(Strength.getInstance(meter)));

    fireEvent.input(input, { target: { value: 'Password123!@#$567' } });

    await waitFor(() => assert.equal(Strength.getInstance(meter)?.getStrength(), 'strong'));
    assert.equal(meter.getAttribute('aria-valuetext'), 'strong');
    assert.equal(screen.getByText('Strong'), meter.querySelector('.strength-text'));

    unmount();

    assert.equal(Strength.getInstance(meter), null);
});
