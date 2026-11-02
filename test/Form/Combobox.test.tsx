import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Combobox, ComboboxGroup, ComboboxOption } from '../../source/Form';

it('updates the controlled value when an option is selected', () => {
    const changed = mock.fn();

    render(
        <Combobox name="country" value="" placeholder="Choose a country" onChange={changed}>
            <ComboboxOption value="ca">Canada</ComboboxOption>
            <ComboboxOption value="jp">Japan</ComboboxOption>
        </Combobox>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Choose a country' }));
    fireEvent.click(screen.getByRole('option', { name: 'Canada' }));

    assert.deepEqual(changed.mock.calls[0].arguments, ['ca']);
});

it('preserves controlled values while asynchronous choices arrive', () => {
    const changed = mock.fn();
    const { rerender, container } = render(
        <Combobox name="remote" value="loaded" placeholder="Loading" onChange={changed} />
    );

    assert.equal(
        container.querySelector<HTMLInputElement>('input[type="hidden"]')?.value,
        'loaded'
    );

    rerender(
        <Combobox name="remote" value="loaded" placeholder="Choose" onChange={changed}>
            <ComboboxOption value="loaded">Loaded option</ComboboxOption>
        </Combobox>
    );

    assert.equal(screen.getByRole('button').textContent, 'Loaded option');
    assert.equal(screen.getByRole('button').getAttribute('aria-haspopup'), 'listbox');
    assert.equal(changed.mock.callCount(), 0);
});

it('filters grouped rich options, normalizes accents and reports no results', () => {
    render(
        <Combobox
            id="country"
            name="country"
            defaultValue="ca"
            controlSize="sm"
            search
            searchNormalize
        >
            <ComboboxGroup label="Americas">
                <ComboboxOption value="ca" description="North America" icon="globe" checkedIcon>
                    Canada
                </ComboboxOption>
                <ComboboxOption value="br" searchText="Brasil São Paulo">
                    Brazil
                </ComboboxOption>
            </ComboboxGroup>
        </Combobox>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Select an item…' }));

    assert.equal(screen.queryByText('No results found'), null);
    assert.equal(screen.getAllByRole('option').length, 2);
    assert.equal(
        screen.getByRole('option', { name: /Canada/ }).getAttribute('aria-selected'),
        'true'
    );

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sao' } });

    assert.equal(screen.getAllByRole('option').length, 1);
    assert.equal(screen.getByRole('option').textContent, 'Brazil');
    assert.ok(document.getElementById('country')?.classList.contains('form-control-sm'));

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'missing' } });

    assert.equal(screen.queryByRole('group'), null);
    assert.equal(screen.getByText('No results found').hidden, false);
});

const OpaqueOptions = () => (
    <ComboboxGroup label="Remote choices">
        <ComboboxOption value="one">First</ComboboxOption>
        <ComboboxOption value="two" disabled>
            Disabled choice
        </ComboboxOption>
    </ComboboxGroup>
);

it('handles opaque server-provided children with option semantics and real empty-state visibility', async () => {
    const changed = mock.fn();
    render(
        <Combobox name="opaque" defaultValue="one" search onChange={changed}>
            <OpaqueOptions />
        </Combobox>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Select an item…' }));

    assert.equal(screen.getAllByRole('option').length, 2);
    assert.equal(
        screen.getByRole('option', { name: 'First' }).getAttribute('aria-selected'),
        'true'
    );
    assert.equal(screen.queryByText('No results found'), null);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'disabled' } });

    assert.equal(screen.getAllByRole('option').length, 1);
    assert.equal(screen.queryByText('No results found'), null);
    fireEvent.click(screen.getByRole('option', { name: 'Disabled choice' }));

    assert.equal(changed.mock.callCount(), 0);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'absent' } });

    assert.equal(screen.queryByRole('group'), null);
    assert.equal(screen.getByRole('status').textContent, 'No results found');
    assert.equal(
        screen.getByRole('listbox').querySelector<HTMLElement>('[data-bs-value="one"]')?.style
            .display,
        'none'
    );

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });

    await waitFor(() => assert.equal(screen.queryByRole('status'), null));
    assert.equal(screen.getAllByRole('option').length, 2);
    assert.equal(screen.getByRole('group').hidden, false);
});

it('derives multiple labels and selected states from opaque rendered choices', () => {
    const changed = mock.fn();
    const { rerender } = render(
        <Combobox name="opaque-multiple" defaultValue={['one', 'two']} multiple onChange={changed}>
            <OpaqueOptions />
        </Combobox>
    );
    const trigger = screen.getByRole('button', { name: 'Select an item…' });

    assert.equal(trigger.textContent, '2 selected');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('option', { name: 'First' }));

    assert.deepEqual(changed.mock.calls[0].arguments, [['two']]);
    assert.equal(trigger.textContent, 'Disabled choice');
    assert.equal(
        screen.getByRole('option', { name: 'First' }).getAttribute('aria-selected'),
        'false'
    );

    rerender(
        <Combobox name="opaque-multiple" value="one" onChange={changed}>
            <OpaqueOptions />
        </Combobox>
    );

    assert.equal(trigger.textContent, 'First');
});

it('toggles multiple values, preserves the open menu and submits named fields', () => {
    const changed = mock.fn();
    const { container, rerender } = render(
        <Combobox name="skills" defaultValue={['react']} multiple onChange={changed}>
            <ComboboxOption value="react" checkedIcon>
                React
            </ComboboxOption>
            <ComboboxOption value="ts" checkedIcon>
                TypeScript
            </ComboboxOption>
            <ComboboxOption value="disabled" disabled>
                Disabled
            </ComboboxOption>
        </Combobox>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Select an item…' }));
    fireEvent.click(screen.getByRole('option', { name: 'TypeScript' }));

    assert.deepEqual(changed.mock.calls[0].arguments, [['react', 'ts']]);
    assert.equal(screen.getByRole('listbox').getAttribute('aria-multiselectable'), 'true');
    assert.equal(screen.getByRole('button', { name: 'Select an item…' }).textContent, '2 selected');
    assert.equal(container.querySelectorAll('input[type="hidden"]').length, 2);

    fireEvent.click(screen.getByRole('option', { name: 'Disabled' }));

    assert.equal(changed.mock.callCount(), 1);

    rerender(<Combobox name="skills" value={['react']} multiple disabled />);

    assert.equal(container.querySelector('input[type="hidden"]')?.hasAttribute('disabled'), true);
});
