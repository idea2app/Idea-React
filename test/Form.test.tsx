import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import {
    Checkbox,
    Chip,
    ChipInput,
    Combobox,
    ComboboxOption,
    DatePicker,
    Form,
    FormAdornment,
    FormAdornmentText,
    FormCheck,
    FormControl,
    FormFeedback,
    FormField,
    FormFieldset,
    FormFloatingLabel,
    FormGhost,
    FormGroup,
    FormLabel,
    FormRange,
    FormSelect,
    FormSwitch,
    FormText,
    FormTextArea,
    getPasswordStrength,
    InputGroup,
    InputGroupText,
    OtpInput,
    PasswordStrength,
    Radio
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
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormControl id="name" placeholder="Name" />
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

it('covers checks, switches, fieldset elements, and custom form control variants', () => {
    render(
        <FormFieldset disabled>
            <Checkbox aria-label="Remember me" size="sm" theme="accent" />
            <Radio aria-label="Choose one" name="choice" size="lg" />
            <FormSwitch inputProps={{ name: 'notifications', defaultChecked: true }}>
                Notifications
            </FormSwitch>
            <FormControl aria-label="Search" type="search" controlSize="lg" caret />
            <FormControl aria-label="Ghost" ghost />
        </FormFieldset>
    );

    assert.equal(screen.getByLabelText('Remember me').className, 'check check-sm theme-accent');
    assert.equal(screen.getByLabelText('Choose one').className, 'radio radio-lg');
    assert.equal((screen.getByLabelText('Notifications') as HTMLInputElement).checked, true);
    assert.equal(screen.getByLabelText('Notifications').closest('label')?.className, 'switch');
    assert.equal(
        screen.getByLabelText('Search').className,
        'form-control form-control-caret form-control-lg'
    );
    assert.equal(screen.getByLabelText('Ghost').className, 'form-ghost');
    assert.equal(screen.getByRole('group').tagName, 'FIELDSET');
});

it('renders form adornments, chips, and form-aware combobox options', () => {
    const changed: (string | string[])[] = [];

    render(
        <>
            <FormAdornment htmlFor="amount" end>
                <FormAdornmentText aria-hidden="true">$</FormAdornmentText>
                <FormGhost id="amount" aria-label="Amount" />
            </FormAdornment>
            <ChipInput theme="primary" separator="," maxChips={3}>
                <Chip active>React</Chip>
                <FormGhost aria-label="Add tag" />
            </ChipInput>
            <Combobox
                name="country"
                value=""
                placeholder="Choose a country"
                onChange={value => changed.push(value)}
            >
                <ComboboxOption value="ca">Canada</ComboboxOption>
                <ComboboxOption value="jp">Japan</ComboboxOption>
            </Combobox>
        </>
    );

    assert.equal(
        screen.getByLabelText('Amount').closest('label')?.className,
        'form-control form-adorn form-adorn-end'
    );
    assert.equal(screen.getByText('React').className, 'chip active');
    assert.equal(screen.getByLabelText('Add tag').className, 'form-ghost');

    fireEvent.click(screen.getByRole('button', { name: 'Choose a country' }));
    fireEvent.click(screen.getByRole('button', { name: 'Canada' }));

    assert.deepEqual(changed, ['ca']);
});

it('supports date, range, OTP, and password-strength controls', () => {
    const onInput = mock.fn();

    render(
        <>
            <DatePicker aria-label="Start date" min="2026-01-01" />
            <FormRange
                aria-label="Volume"
                min={0}
                max={100}
                defaultValue={50}
                bubble
                onInput={onInput}
            />
            <OtpInput aria-label="Verification code" length={6} groups={[3, 3]} mask />
            <PasswordStrength value="Password123!" />
            <PasswordStrength value="Password123!" variant="bar" />
        </>
    );

    assert.equal(screen.getByLabelText('Start date').getAttribute('type'), 'date');
    const range = screen.getByLabelText('Volume');
    assert.equal(range.className, 'form-range-input');
    assert.equal(range.parentElement?.getAttribute('data-bs-bubble'), 'true');
    fireEvent.input(range, { target: { value: '75' } });
    assert.equal(range.parentElement?.style.getPropertyValue('--range-fill'), '0.75');
    assert.equal(onInput.mock.callCount(), 1);
    assert.equal(
        screen.getByLabelText('Verification code').getAttribute('autocomplete'),
        'one-time-code'
    );
    assert.equal(screen.getAllByRole('meter').length, 2);
    assert.equal(screen.getAllByRole('meter')[0].getAttribute('aria-valuetext'), 'good');
});

it('sanitizes password strength levels and maps Bootstrap strength criteria', () => {
    assert.equal(getPasswordStrength(''), null);
    assert.equal(getPasswordStrength('password'), 'weak');
    assert.equal(getPasswordStrength('Password123!@#$567'), 'strong');

    render(<PasswordStrength value="password" messages={{ weak: 'Needs work' }} />);

    assert.equal(screen.getByText('Needs work').className, 'strength-text');
    assert.equal(screen.getByRole('meter').getAttribute('aria-valuetext'), 'weak');
});
