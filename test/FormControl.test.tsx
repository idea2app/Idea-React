import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { FormControl, FormGhost, FormSelect, FormTextArea } from '../source/Form';

it('renders styled native controls and preserves native attributes', () => {
    render(
        <>
            <FormControl aria-label="Email" type="email" required />
            <FormSelect aria-label="Country" controlSize="sm" defaultValue="ca">
                <option value="ca">Canada</option>
            </FormSelect>
            <FormTextArea aria-label="Message" rows={3} />
            <FormControl aria-label="Plaintext" value="Readonly" plaintext readOnly />
            <FormGhost aria-label="Ghost" />
        </>
    );

    assert.equal(screen.getByLabelText('Email').className, 'form-control');
    assert.equal(screen.getByLabelText('Email').hasAttribute('required'), true);
    assert.equal(screen.getByLabelText('Country').className, 'form-control form-control-sm');
    assert.equal(screen.getByLabelText('Message').tagName, 'TEXTAREA');
    assert.equal(screen.getByLabelText('Plaintext').className, 'form-control-plaintext');
    assert.equal(screen.getByLabelText('Plaintext').hasAttribute('readonly'), true);
    assert.equal(screen.getByLabelText('Ghost').className, 'form-ghost');
});
