import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { ToggleButton } from '../source/ToggleButton';

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
