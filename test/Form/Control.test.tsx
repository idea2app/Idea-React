import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { FormControl, FormGhost, FormSelect, FormTextArea } from '../../source/Form';

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

it('covers native input types, sizing, validation and multiple select attributes', () => {
    render(
        <>
            <FormControl aria-label="File" type="file" controlSize="lg" multiple />
            <FormControl aria-label="Color" type="color" defaultValue="#663399" color />
            <FormControl aria-label="Date" type="date" caret />
            <FormControl aria-label="Invalid" validation="invalid" required />
            <FormControl aria-label="Disabled" disabled />
            <FormSelect
                aria-label="Multiple"
                size={3}
                validation="valid"
                defaultValue={['ca']}
                multiple
            >
                <option value="ca">Canada</option>
            </FormSelect>
            <FormTextArea aria-label="Large message" controlSize="lg" validation="invalid" />
        </>
    );
    assert.equal(screen.getByLabelText('File').className, 'form-control form-control-lg');
    assert.equal(screen.getByLabelText('File').hasAttribute('multiple'), true);
    assert.equal(screen.getByLabelText('Color').className, 'form-control form-control-color');
    assert.equal(screen.getByLabelText('Date').className, 'form-control form-control-caret');
    assert.equal(screen.getByLabelText('Invalid').getAttribute('aria-invalid'), 'true');
    assert.equal(screen.getByLabelText('Disabled').hasAttribute('disabled'), true);
    assert.equal(screen.getByLabelText('Multiple').className, 'form-control is-valid');
    assert.equal(screen.getByLabelText('Multiple').getAttribute('size'), '3');
    assert.equal(
        screen.getByLabelText('Large message').className,
        'form-control form-control-lg is-invalid'
    );
});
