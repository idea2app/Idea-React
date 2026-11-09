import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Checkbox, FormCheck } from '../../source/Form';

it('sets the native indeterminate property through a prop', () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = render(<Checkbox ref={ref} aria-label="Select all" indeterminate />);
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;

    assert.equal(checkbox.indeterminate, true);
    assert.equal(checkbox.getAttribute('aria-checked'), 'mixed');
    assert.equal(ref.current, checkbox);

    rerender(<Checkbox aria-label="Select all" />);

    assert.equal(checkbox.indeterminate, false);
    assert.equal(checkbox.hasAttribute('aria-checked'), false);
});

it('renders native form checks', () => {
    render(<FormCheck aria-label="Accept terms" />);

    assert.equal(screen.getByLabelText('Accept terms').className, 'check');
});

it('adds list group item styling to form checks', () => {
    render(
        <>
            <FormCheck aria-label="Select item" listGroup />
            <FormCheck aria-label="Choose item" type="radio" listGroup />
        </>
    );

    assert.equal(
        screen.getByRole('checkbox', { name: 'Select item' }).className,
        'check list-group-item-check'
    );
    assert.equal(
        screen.getByRole('radio', { name: 'Choose item' }).className,
        'radio list-group-item-check'
    );
});
