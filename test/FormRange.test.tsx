import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { FormRange } from '../source/Form';

it('updates the track fill and forwards native input events', () => {
    const onInput = mock.fn();

    render(<FormRange aria-label="Volume" min={0} max={100} defaultValue={50} onInput={onInput} />);

    const range = screen.getByLabelText('Volume');

    fireEvent.input(range, { target: { value: '75' } });

    assert.equal(range.parentElement?.style.getPropertyValue('--range-fill'), '0.75');
    assert.equal(onInput.mock.callCount(), 1);
});
