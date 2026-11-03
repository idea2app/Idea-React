import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { FormRange } from '../../source/Form';

it('updates the track fill and forwards native input events', async () => {
    const onInput = mock.fn();

    render(<FormRange aria-label="Volume" min={0} max={100} defaultValue={50} onInput={onInput} />);

    const range = screen.getByLabelText('Volume');
    const { default: Range } = await import('bootstrap/js/src/range.js');

    await waitFor(() => assert.ok(Range.getInstance(range.parentElement)));

    fireEvent.input(range, { target: { value: '75' } });

    assert.equal(range.parentElement?.style.getPropertyValue('--bs-range-fill'), '0.75');
    assert.equal(onInput.mock.callCount(), 1);
});

it('renders bubble, uneven ticks, fractional steps and controlled updates', async () => {
    const formatter = (value: number) => `${value}%`;
    const { default: Range } = await import('bootstrap/js/src/range.js');
    const { rerender, unmount } = render(
        <>
            <FormRange
                aria-label="Brightness"
                value={25}
                formatter={formatter}
                theme="success"
                step={0.5}
                list="brightness-ticks"
                validation="invalid"
                readOnly
                bubble
            />
            <datalist id="brightness-ticks">
                <option value="0" label="Dark" />
                <option value="25" />
                <option value="100" label="Bright" />
            </datalist>
        </>
    );
    const input = screen.getByLabelText('Brightness');
    const wrapper = input.parentElement!;

    await waitFor(() => assert.ok(wrapper.querySelector('.form-range-bubble')));

    assert.equal(wrapper.querySelector('.tooltip-inner')?.textContent, '25%');
    assert.equal(wrapper.querySelectorAll('.form-range-tick').length, 3);
    assert.ok(wrapper.classList.contains('theme-success'));
    assert.ok(wrapper.classList.contains('is-invalid'));
    assert.ok(input.classList.contains('is-invalid'));
    assert.equal(input.getAttribute('aria-invalid'), 'true');
    assert.equal(input.getAttribute('step'), '0.5');

    rerender(
        <FormRange aria-label="Brightness" value={75} formatter={formatter} readOnly bubble />
    );
    await waitFor(() => assert.equal(wrapper.querySelector('.tooltip-inner')?.textContent, '75%'));

    unmount();

    assert.equal(Range.getInstance(wrapper), null);
});
