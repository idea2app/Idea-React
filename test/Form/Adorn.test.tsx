import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { FormAdornment, FormAdornmentText, FormGhost } from '../../source/Form';

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
