import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';

import { FormControl, FormField, FormLabel, PasswordStrength } from '../../source/Form';

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
    assert.equal(screen.getByText('Strong'), meter.nextElementSibling);

    unmount();

    assert.equal(Strength.getInstance(meter), null);
});

it('renders all static strength levels in segmented and bar shapes without JavaScript scoring', () => {
    const { rerender } = render(
        <PasswordStrength strength="fair" messages={{ fair: 'Keep going' }} />
    );
    const meter = screen.getByRole('meter');

    assert.equal(meter.dataset.bsStrength, 'fair');
    assert.equal(meter.querySelectorAll('.strength-segment.active').length, 2);
    assert.equal(meter.getAttribute('aria-valuenow'), '2');
    assert.equal(screen.getByText('Keep going').className, 'strength-text');

    rerender(<PasswordStrength strength="strong" variant="bar" showText={false} />);

    assert.equal(meter.className, 'strength-bar');
    assert.equal(meter.dataset.bsStrength, 'strong');
    assert.equal(meter.getAttribute('aria-valuenow'), '4');
    assert.equal(meter.children.length, 0);
});
