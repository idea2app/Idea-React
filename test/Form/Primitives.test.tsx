import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import {
    Form,
    FormField,
    FormFieldContent,
    FormGroup,
    FormLabel,
    FormLegend
} from '../../source/Form';

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
            <fieldset disabled>
                <legend>Disabled fields</legend>
            </fieldset>
        </Form>
    );
    assert.equal(screen.getByRole('form', { name: 'Profile' }).tagName, 'FORM');
    assert.equal(screen.getByLabelText('Email').parentElement?.className, 'form-field');
    assert.equal(screen.getByTestId('field-content').className, 'form-field-content');
    assert.equal(screen.getByRole('group').tagName, 'FIELDSET');
    assert.equal((screen.getByRole('group') as HTMLFieldSetElement).disabled, true);
});

it('sizes horizontal labels and fieldset legends consistently with controls', () => {
    render(
        <fieldset>
            <FormLegend controlSize="lg" column>
                Details
            </FormLegend>
            <FormLabel controlSize="sm" htmlFor="horizontal" column>
                Name
            </FormLabel>
            <input id="horizontal" />
        </fieldset>
    );
    assert.equal(screen.getByText('Details').className, 'col-form-label col-form-label-lg');
    assert.equal(screen.getByText('Name').className, 'col-form-label col-form-label-sm');
});

it('supports validated forms, grouped cards and ordinary control labels', () => {
    render(
        <Form aria-label="Plans" validated noValidate>
            <FormGroup>
                <FormLabel>Choose a plan</FormLabel>
                <FormField card>
                    <input type="radio" name="plan" id="basic" required defaultChecked />
                    <FormFieldContent>
                        <FormLabel htmlFor="basic" plain>
                            Basic
                        </FormLabel>
                    </FormFieldContent>
                </FormField>
            </FormGroup>
        </Form>
    );
    const form = screen.getByRole('form') as HTMLFormElement;
    const radio = screen.getByRole('radio');

    assert.equal(form.className, 'was-validated');
    assert.equal(form.hasAttribute('novalidate'), true);
    assert.equal(radio.parentElement?.className, 'form-field form-field-card');
    assert.equal(screen.getByText('Basic').className, '');
    assert.equal(form.checkValidity(), true);
});
