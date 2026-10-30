import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Option, Select } from '../source/Select';

it('renders Bootstrap 6 menu options and reports the selected value', () => {
    const selected: string[] = [];

    render(
        <Select value="first" onChange={value => selected.push(value)}>
            <Option value="first">First option</Option>
            <Option value="second">Second option</Option>
        </Select>
    );

    fireEvent.click(screen.getByRole('button', { name: 'First option' }));
    fireEvent.click(screen.getByRole('button', { name: 'Second option' }));

    assert.deepEqual(selected, ['second']);
});
