import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { ToggleButton } from '../../source/Base/ToggleButton';

it('forwards change events, input attributes and button sizing', () => {
    const onChange = mock.fn();
    render(
        <ToggleButton
            size="sm"
            id="choice"
            autoComplete="email"
            aria-describedby="hint"
            required
            onChange={onChange}
        >
            Choice
        </ToggleButton>
    );
    const input = screen.getByRole('checkbox', { name: 'Choice' }) as HTMLInputElement;

    assert.equal(input.id, 'choice');
    assert.equal(input.autocomplete, 'email');
    assert.equal(input.required, true);
    assert.equal(input.getAttribute('aria-describedby'), 'hint');
    assert.ok(input.parentElement?.classList.contains('btn-sm'));

    fireEvent.click(input);

    assert.equal(onChange.mock.callCount(), 1);
    assert.equal(input.checked, true);
});

it('renders a checkbox toggle button', () => {
    render(
        <ToggleButton className="custom" defaultChecked>
            Checked
        </ToggleButton>
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Checked' });

    assert.equal(checkbox.getAttribute('type'), 'checkbox');
    assert.equal(checkbox.getAttribute('autocomplete'), 'off');
    assert.equal((checkbox as HTMLInputElement).checked, true);
    assert.equal(checkbox.parentElement?.className, 'btn-check btn-solid custom');
});

it('renders a disabled radio toggle with a theme', () => {
    render(
        <ToggleButton type="radio" name="options" theme="primary" disabled>
            Option
        </ToggleButton>
    );
    const radio = screen.getByRole('radio', { name: 'Option' });

    assert.equal(radio.getAttribute('name'), 'options');
    assert.equal((radio as HTMLInputElement).disabled, true);
    assert.equal(radio.parentElement?.className, 'btn-check btn-solid theme-primary');
});
