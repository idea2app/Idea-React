import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Form, FormField, FormFieldContent, FormFieldset, FormGroup, FormLabel } from '../source/Form';

it('renders native form structure and field wrappers', () => {
    render(
        <Form aria-label="Profile">
            <FormGroup>
                <FormField>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <input id="email" />
                </FormField>
                <FormFieldContent data-testid="field-content">Content</FormFieldContent>
            </FormGroup>
            <FormFieldset disabled>
                <legend>Disabled fields</legend>
            </FormFieldset>
        </Form>
    );

    assert.equal(screen.getByRole('form', { name: 'Profile' }).tagName, 'FORM');
    assert.equal(screen.getByLabelText('Email').parentElement?.className, 'form-field');
    assert.equal(screen.getByTestId('field-content').className, 'form-field-content');
    assert.equal(screen.getByRole('group').tagName, 'FIELDSET');
    assert.equal((screen.getByRole('group') as HTMLFieldSetElement).disabled, true);
});
