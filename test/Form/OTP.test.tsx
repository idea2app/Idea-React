import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { OTPInput } from '../../source/Form';

it('renders a single accessible one-time-code input with OTP options', () => {
    render(
        <OTPInput aria-label="Verification code" length={6} groups={[3, 3]} separator="-" mask />
    );
    const input = screen.getByLabelText('Verification code');
    const wrapper = input.parentElement;

    assert.equal(input.getAttribute('autocomplete'), 'one-time-code');
    assert.equal(input.getAttribute('maxlength'), '6');
    assert.equal(wrapper?.dataset.bsOtp, '');
    assert.equal(wrapper?.dataset.bsGroups, '[3,3]');
    assert.equal(wrapper?.dataset.bsSeparator, '-');
    assert.equal(wrapper?.dataset.bsMask, 'true');
    assert.ok(wrapper?.classList.contains('min-w-0'));
    assert.ok(wrapper?.classList.contains('max-w-100'));
});

it('allows grouped slots to shrink within narrow containers without dropping digits', async () => {
    render(
        <div style={{ width: 280 }}>
            <OTPInput aria-label="Narrow code" length={6} groups={[3, 3]} separator="-" />
        </div>
    );
    const wrapper = screen.getByLabelText('Narrow code').parentElement!;

    await waitFor(() => assert.equal(wrapper.querySelectorAll('.otp-slot').length, 6));

    const slots = wrapper.querySelector('.otp-slots')!;
    assert.ok(slots.classList.contains('min-w-0'));
    assert.ok(slots.classList.contains('max-w-100'));
    assert.equal(slots.querySelectorAll('.otp-slot.min-w-0').length, 6);
    assert.equal(slots.querySelector('.otp-separator')?.textContent, '-');
});

it('renders grouped masked slots, sanitizes paste and notifies completion', async () => {
    const complete = mock.fn();
    const changed = mock.fn();
    const { default: Plugin } = await import('bootstrap/js/src/otp-input.js');
    const { unmount } = render(
        <OTPInput
            aria-label="PIN"
            length={4}
            groups={[2, 2]}
            separator="-"
            size="lg"
            validation="invalid"
            mask
            connected
            onComplete={complete}
            onValueChange={changed}
        />
    );
    const input = screen.getByLabelText('PIN') as HTMLInputElement;
    const wrapper = input.parentElement!;

    await waitFor(() => assert.equal(wrapper.querySelectorAll('.otp-slot').length, 4));

    fireEvent.paste(input, { clipboardData: { getData: () => '12-34' } });

    assert.equal(input.value, '1234');
    assert.equal(wrapper.querySelector('.otp-separator')?.textContent, '-');
    assert.equal(wrapper.querySelector('.otp-slot')?.textContent, '•');
    assert.equal(complete.mock.calls[0].arguments[0], '1234');
    assert.ok(changed.mock.callCount() > 0);
    assert.ok(wrapper.classList.contains('is-invalid'));

    unmount();

    assert.equal(Plugin.getInstance(wrapper), null);
});

it('updates controlled values and rebuilds changed configurations without duplicate slots', async () => {
    const { rerender } = render(
        <OTPInput aria-label="Code" length={4} value="AB12" type="alphanumeric" readOnly />
    );
    const input = screen.getByLabelText('Code');
    const wrapper = input.parentElement!;

    await waitFor(() => assert.equal(wrapper.querySelectorAll('.otp-slot-filled').length, 4));

    rerender(<OTPInput aria-label="Code" length={3} value="XYZ" type="alpha" readOnly connected />);

    await waitFor(() => assert.equal(wrapper.querySelectorAll('.otp-slot').length, 3));
    assert.equal(wrapper.querySelectorAll('.otp-slot-filled').length, 3);
    assert.equal(input.getAttribute('inputmode'), 'text');
});
