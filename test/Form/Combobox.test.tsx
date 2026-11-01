import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Combobox, ComboboxOption } from '../../source/Form';

it('updates the controlled value when an option is selected', () => {
    const changed: (string | string[])[] = [];

    render(
        <Combobox
            name="country"
            value=""
            placeholder="Choose a country"
            onChange={value => changed.push(value)}
        >
            <ComboboxOption value="ca">Canada</ComboboxOption>
            <ComboboxOption value="jp">Japan</ComboboxOption>
        </Combobox>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Choose a country' }));
    fireEvent.click(screen.getByRole('button', { name: 'Canada' }));

    assert.deepEqual(changed, ['ca']);
});
