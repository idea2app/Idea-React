import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { OTPInput } from '../source/Form';

it('renders a single accessible one-time-code input with OTP options', () => {
    render(
        <OTPInput
            aria-label="Verification code"
            length={6}
            groups={[3, 3]}
            separator="-"
            mask
        />
    );

    const input = screen.getByLabelText('Verification code');
    const wrapper = input.parentElement;

    assert.equal(input.getAttribute('autocomplete'), 'one-time-code');
    assert.equal(input.getAttribute('maxlength'), '6');
    assert.equal(wrapper?.dataset.bsOtp, '');
    assert.equal(wrapper?.dataset.bsGroups, '[3,3]');
    assert.equal(wrapper?.dataset.bsSeparator, '-');
    assert.equal(wrapper?.dataset.bsMask, 'true');
});
