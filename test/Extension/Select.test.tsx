import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Option, Select } from '../../source/Extension/Select';

it('renders Bootstrap 6 menu options and reports the selected value', () => {
    const selected = mock.fn();

    render(
        <Select value="first" onChange={selected}>
            <Option value="first">First option</Option>
            <Option value="second">Second option</Option>
        </Select>
    );
    fireEvent.click(screen.getByRole('button', { name: 'First option' }));
    fireEvent.click(screen.getByRole('button', { name: 'Second option' }));

    assert.deepEqual(selected.mock.calls[0].arguments, ['second']);
});

it('marks selected options, ignores disabled choices and supports native form submission', () => {
    const changed = mock.fn();
    const { container, rerender } = render(
        <Select name="framework" value="react" onChange={changed}>
            <Option value="react">React</Option>
            <Option value="vue" disabled>
                Vue
            </Option>
        </Select>
    );
    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    fireEvent.click(screen.getByRole('button', { name: 'Vue' }));

    assert.equal(changed.mock.callCount(), 0);
    assert.equal(
        screen.getAllByRole('button', { name: 'React' })[1].getAttribute('aria-selected'),
        'true'
    );
    assert.equal(container.querySelector('input')?.value, 'react');

    rerender(<Select name="framework" value="" placeholder="Choose" disabled />);

    assert.equal(screen.getByRole('button', { name: 'Choose' }).hasAttribute('disabled'), true);
    assert.equal(container.querySelector('input')?.disabled, true);
});
