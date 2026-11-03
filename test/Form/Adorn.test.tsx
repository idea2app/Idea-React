import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { FormAdornment, FormAdornmentIcon, FormAdornmentText, FormGhost } from '../../source/Form';

it('renders an associated form adornment with a ghost control', () => {
    render(
        <FormAdornment htmlFor="amount" end>
            <FormAdornmentText aria-hidden="true">$</FormAdornmentText>
            <FormGhost id="amount" aria-label="Amount" />
        </FormAdornment>
    );
    assert.equal(
        screen.getByLabelText('Amount').closest('label')?.className,
        'form-control form-adorn form-adorn-end'
    );
    assert.equal(screen.getByText('$').className, 'form-adorn-text');
});

it('uses form-control sizing and an Icon wrapper for adorned fields', () => {
    render(
        <FormAdornment htmlFor="search" size="sm" validation="invalid">
            <FormAdornmentIcon name="search" aria-hidden="true" />
            <FormGhost id="search" aria-label="Search" validation="invalid" />
        </FormAdornment>
    );
    const input = screen.getByLabelText('Search');

    assert.equal(
        input.parentElement?.className,
        'form-control form-adorn form-control-sm is-invalid'
    );
    assert.equal(
        input.parentElement?.querySelector('.bi-search')?.className,
        'bi-search form-adorn-icon'
    );
    assert.equal(input.getAttribute('aria-invalid'), 'true');
});
