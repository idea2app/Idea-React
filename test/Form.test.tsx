import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import {
    Form,
    FormCheck,
    FormControl,
    FormFeedback,
    FormField,
    FormFloatingLabel,
    FormGroup,
    FormLabel,
    FormSelect,
    FormText,
    FormTextArea,
    InputGroup,
    InputGroupText
} from '../source/Form';

it('renders Bootstrap 6 form field wrappers and native controls', () => {
    render(
        <Form aria-label="Profile">
            <FormGroup>
                <FormField>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl id="email" name="email" type="email" required />
                    <FormText id="email-help">Use your work email.</FormText>
                </FormField>
                <FormField>
                    <FormCheck id="terms" name="terms" type="checkbox" />
                    <FormLabel htmlFor="terms">Accept terms</FormLabel>
                </FormField>
                <FormField>
                    <FormLabel htmlFor="country">Country</FormLabel>
                    <FormSelect id="country" defaultValue="ca">
                        <option value="ca">Canada</option>
                    </FormSelect>
                </FormField>
                <FormField>
                    <FormLabel htmlFor="message">Message</FormLabel>
                    <FormTextArea id="message" rows={3} />
                </FormField>
            </FormGroup>
        </Form>
    );

    assert.equal(screen.getByRole('form', { name: 'Profile' }).tagName, 'FORM');
    assert.equal(screen.getByLabelText('Email').className, 'form-control');
    assert.equal(screen.getByLabelText('Accept terms').className, 'check');
    assert.equal(screen.getByLabelText('Country').className, 'form-control');
    assert.equal(screen.getByLabelText('Message').tagName, 'TEXTAREA');
    assert.equal(screen.getByText('Use your work email.').className, 'form-text');
});

it('renders floating labels, input groups, and validation feedback', () => {
    render(
        <>
            <FormFloatingLabel always>
                <FormControl id="name" placeholder="Name" />
                <FormLabel htmlFor="name">Name</FormLabel>
            </FormFloatingLabel>
            <InputGroup>
                <InputGroupText>@</InputGroupText>
                <FormControl aria-label="Username" />
            </InputGroup>
            <FormFeedback type="valid">Looks good.</FormFeedback>
            <FormFeedback tooltip>Required.</FormFeedback>
        </>
    );

    assert.ok(
        screen.getByLabelText('Name').parentElement?.className.includes('form-floating-always')
    );
    assert.equal(screen.getByText('@').className, 'input-group-text');
    assert.equal(screen.getByText('Looks good.').className, 'valid-feedback');
    assert.equal(screen.getByText('Required.').className, 'invalid-tooltip');
});

it('supports plaintext controls and custom classes', () => {
    render(<FormControl className="w-100" aria-label="Read only value" plaintext readOnly />);

    const control = screen.getByLabelText('Read only value');
    assert.equal(control.className, 'form-control-plaintext w-100');
    assert.equal(control.hasAttribute('readonly'), true);
});
