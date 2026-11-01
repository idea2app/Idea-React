'use client';

import classNames from 'classnames';
import {
    Children,
    cloneElement,
    ComponentPropsWithRef,
    CSSProperties,
    FC,
    isValidElement,
    ReactNode
} from 'react';

import type { ComponentTheme } from './Button';
import { Menu } from './Menu';

const CONTROL_SIZES = {
    sm: 'form-control-sm',
    lg: 'form-control-lg'
} as const;

export type FormProps = ComponentPropsWithRef<'form'>;

export const Form: FC<FormProps> = props => <form {...props} />;

Form.displayName = 'Form';

export type FormFieldsetProps = ComponentPropsWithRef<'fieldset'>;

export const FormFieldset: FC<FormFieldsetProps> = props => <fieldset {...props} />;

FormFieldset.displayName = 'FormFieldset';

export type FormFieldProps = ComponentPropsWithRef<'div'>;

export const FormField: FC<FormFieldProps> = ({ className, ...props }) => (
    <div {...props} className={classNames('form-field', className)} />
);

FormField.displayName = 'FormField';

export type FormGroupProps = ComponentPropsWithRef<'div'>;

export const FormGroup: FC<FormGroupProps> = ({ className, ...props }) => (
    <div {...props} className={classNames('form-group', className)} />
);

FormGroup.displayName = 'FormGroup';

export type FormFieldContentProps = ComponentPropsWithRef<'div'>;

export const FormFieldContent: FC<FormFieldContentProps> = ({ className, ...props }) => (
    <div {...props} className={classNames('form-field-content', className)} />
);

FormFieldContent.displayName = 'FormFieldContent';

export type FormLabelProps = ComponentPropsWithRef<'label'>;

export const FormLabel: FC<FormLabelProps> = ({ className, ...props }) => (
    <label {...props} className={classNames('form-label', className)} />
);

FormLabel.displayName = 'FormLabel';

export type FormControlProps = ComponentPropsWithRef<'input'> & {
    plaintext?: boolean;
    ghost?: boolean;
    caret?: boolean;
    color?: boolean;
    controlSize?: 'sm' | 'lg';
};

export const FormControl: FC<FormControlProps> = ({
    className,
    plaintext,
    ghost,
    caret,
    color,
    controlSize,
    ...props
}) => (
    <input
        {...props}
        className={classNames(
            ghost ? 'form-ghost' : plaintext ? 'form-control-plaintext' : 'form-control',
            !ghost && caret && 'form-control-caret',
            !ghost && !plaintext && color && 'form-control-color',
            !ghost && !plaintext && controlSize && CONTROL_SIZES[controlSize],
            className
        )}
    />
);

FormControl.displayName = 'FormControl';

export type FormTextAreaProps = ComponentPropsWithRef<'textarea'>;

export const FormTextArea: FC<FormTextAreaProps> = ({ className, ...props }) => (
    <textarea {...props} className={classNames('form-control', className)} />
);

FormTextArea.displayName = 'FormTextArea';

export type FormSelectProps = ComponentPropsWithRef<'select'>;

export const FormSelect: FC<FormSelectProps> = ({ className, ...props }) => (
    <select {...props} className={classNames('form-control', className)} />
);

FormSelect.displayName = 'FormSelect';

export type FormCheckProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> & {
    type?: 'checkbox' | 'radio';
    size?: 'sm' | 'lg';
    theme?: ComponentTheme;
};

export const FormCheck: FC<FormCheckProps> = ({
    className,
    type = 'checkbox',
    size,
    theme,
    ...props
}) => (
    <input
        {...props}
        type={type}
        className={classNames(
            type === 'checkbox' ? 'check' : 'radio',
            size && `${type === 'checkbox' ? 'check' : 'radio'}-${size}`,
            theme && `theme-${theme}`,
            className
        )}
    />
);

FormCheck.displayName = 'FormCheck';

export const Checkbox: FC<Omit<FormCheckProps, 'type'>> = props => (
    <FormCheck {...props} type="checkbox" />
);

Checkbox.displayName = 'Checkbox';

export const Radio: FC<Omit<FormCheckProps, 'type'>> = props => (
    <FormCheck {...props} type="radio" />
);

Radio.displayName = 'Radio';

export type FormSwitchProps = Omit<ComponentPropsWithRef<'label'>, 'children'> & {
    inputProps?: Omit<ComponentPropsWithRef<'input'>, 'type'>;
    size?: 'sm' | 'lg';
    theme?: ComponentTheme;
    children?: ReactNode;
};

export const FormSwitch: FC<FormSwitchProps> = ({
    className,
    inputProps,
    size,
    theme,
    children,
    ...props
}) => (
    <label
        {...props}
        className={classNames(
            'switch',
            size && `switch-${size}`,
            theme && `theme-${theme}`,
            className
        )}
    >
        <input {...inputProps} type="checkbox" />
        {children}
    </label>
);

FormSwitch.displayName = 'FormSwitch';

export type FormTextProps = ComponentPropsWithRef<'small'>;

export const FormText: FC<FormTextProps> = ({ className, ...props }) => (
    <small {...props} className={classNames('form-text', className)} />
);

FormText.displayName = 'FormText';

export type FormFeedbackProps = Omit<ComponentPropsWithRef<'div'>, 'type'> & {
    type?: 'valid' | 'invalid';
    tooltip?: boolean;
};

export const FormFeedback: FC<FormFeedbackProps> = ({
    className,
    type = 'invalid',
    tooltip,
    ...props
}) => (
    <div
        {...props}
        className={classNames(tooltip ? `${type}-tooltip` : `${type}-feedback`, className)}
    />
);

FormFeedback.displayName = 'FormFeedback';

export type FormFloatingLabelProps = ComponentPropsWithRef<'div'> & {
    always?: boolean;
};

export const FormFloatingLabel: FC<FormFloatingLabelProps> = ({ className, always, ...props }) => (
    <div
        {...props}
        className={classNames('form-floating', always && 'form-floating-always', className)}
    />
);

FormFloatingLabel.displayName = 'FormFloatingLabel';

export type FormAdornmentProps = Omit<ComponentPropsWithRef<'label'>, 'htmlFor'> & {
    end?: boolean;
    size?: 'sm' | 'lg';
    htmlFor?: string;
};

export const FormAdornment: FC<FormAdornmentProps> = ({ className, end, size, ...props }) => (
    <label
        {...props}
        className={classNames(
            'form-control form-adorn',
            end && 'form-adorn-end',
            size && `form-adorn-${size}`,
            className
        )}
    />
);

FormAdornment.displayName = 'FormAdornment';

export type FormAdornmentTextProps = ComponentPropsWithRef<'span'>;

export const FormAdornmentText: FC<FormAdornmentTextProps> = ({ className, ...props }) => (
    <span {...props} className={classNames('form-adorn-text', className)} />
);

FormAdornmentText.displayName = 'FormAdornmentText';

export type FormGhostProps = ComponentPropsWithRef<'input'>;

export const FormGhost: FC<FormGhostProps> = ({ className, ...props }) => (
    <input {...props} className={classNames('form-ghost', className)} />
);

FormGhost.displayName = 'FormGhost';

export type InputGroupProps = ComponentPropsWithRef<'div'>;

export const InputGroup: FC<InputGroupProps> = ({ className, ...props }) => (
    <div {...props} className={classNames('input-group', className)} />
);

InputGroup.displayName = 'InputGroup';

export type InputGroupTextProps = ComponentPropsWithRef<'span'>;

export const InputGroupText: FC<InputGroupTextProps> = ({ className, ...props }) => (
    <span {...props} className={classNames('input-group-text', className)} />
);

InputGroupText.displayName = 'InputGroupText';

export type FormRangeProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
    bubble?: boolean;
};

export const FormRange: FC<FormRangeProps> = ({
    className,
    min = 0,
    max = 100,
    value,
    defaultValue,
    bubble,
    onInput,
    style,
    ...props
}) => {
    const currentValue = Number(value ?? defaultValue ?? min);
    const fill =
        Number(max) <= Number(min)
            ? 0
            : Math.max(0, Math.min(1, (currentValue - Number(min)) / (Number(max) - Number(min))));

    return (
        <div
            className="form-range"
            data-bs-bubble={bubble || undefined}
            style={{ '--range-fill': fill } as CSSProperties}
        >
            <input
                {...props}
                type="range"
                min={min}
                max={max}
                value={value}
                defaultValue={defaultValue}
                className={classNames('form-range-input', className)}
                style={style}
                onInput={event => {
                    const input = event.currentTarget;
                    const range = Number(input.value);

                    input.parentElement?.style.setProperty(
                        '--range-fill',
                        String(
                            Number(max) <= Number(min)
                                ? 0
                                : Math.max(
                                      0,
                                      Math.min(
                                          1,
                                          (range - Number(min)) / (Number(max) - Number(min))
                                      )
                                  )
                        )
                    );
                    onInput?.(event);
                }}
            />
        </div>
    );
};

FormRange.displayName = 'FormRange';

export type ChipProps = ComponentPropsWithRef<'button'> & {
    active?: boolean;
    theme?: ComponentTheme;
};

export const Chip: FC<ChipProps> = ({ className, active, disabled, theme, ...props }) => (
    <button
        {...props}
        className={classNames('chip', active && 'active', theme && `theme-${theme}`, className)}
        type="button"
        aria-pressed={active}
        disabled={disabled}
    />
);

Chip.displayName = 'Chip';

export type ChipInputProps = ComponentPropsWithRef<'div'> & {
    theme?: ComponentTheme;
    separator?: string;
    allowDuplicates?: boolean;
    maxChips?: number;
    createOnBlur?: boolean;
};

export const ChipInput: FC<ChipInputProps> = ({
    className,
    theme,
    separator,
    allowDuplicates,
    maxChips,
    createOnBlur,
    ...props
}) => (
    <div
        {...props}
        className={classNames('chip-input', theme && `theme-${theme}`, className)}
        data-bs-chips=""
        data-bs-separator={separator}
        data-bs-allow-duplicates={allowDuplicates}
        data-bs-max-chips={maxChips}
        data-bs-create-on-blur={createOnBlur}
    />
);

ChipInput.displayName = 'ChipInput';

export interface ComboboxOptionProps extends ComponentPropsWithRef<'button'> {
    value: string;
}

export const ComboboxOption: FC<ComboboxOptionProps> = ({ className, value, ...props }) => (
    <button
        {...props}
        type="button"
        className={classNames('menu-item', className)}
        data-bs-value={value}
    />
);

ComboboxOption.displayName = 'ComboboxOption';

export interface ComboboxProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
    name: string;
    value: string | string[];
    placeholder?: string;
    disabled?: boolean;
    multiple?: boolean;
    onChange?: (value: string | string[]) => unknown;
    menuClassName?: string;
}

export const Combobox: FC<ComboboxProps> = ({
    className,
    name,
    value,
    placeholder = 'Select an item…',
    disabled,
    multiple,
    onChange,
    menuClassName,
    children,
    ...props
}) => {
    const values = Array.isArray(value) ? value : value ? [value] : [];
    const options = Children.toArray(children).filter(
        (option): option is React.ReactElement<ComboboxOptionProps> =>
            isValidElement<ComboboxOptionProps>(option)
    );
    const selected = options.filter(option => values.includes(option.props.value));
    const hasSelection = selected.length > 0;
    const handleClick: ComponentPropsWithRef<'div'>['onClick'] = ({ target }) => {
        if (!(target instanceof Element)) return;

        const option = target.closest<HTMLButtonElement>('[data-bs-value]');
        if (!option || !onChange) return;

        const next = option.dataset.bsValue || '';
        onChange(
            multiple
                ? values.includes(next)
                    ? values.filter(item => item !== next)
                    : [...values, next]
                : next
        );
    };

    return (
        <div {...props} className={classNames('combobox', className)}>
            <Menu
                label={
                    <span
                        className={classNames(
                            'combobox-value',
                            !hasSelection && 'combobox-placeholder'
                        )}
                    >
                        {hasSelection ? selected.map(option => option.props.children) : placeholder}
                    </span>
                }
                toggleProps={{
                    className: 'form-control combobox-toggle',
                    variant: 'text',
                    disabled,
                    'aria-haspopup': 'listbox',
                    'aria-label': placeholder
                }}
                autoClose={!multiple}
                menuClassName={classNames(menuClassName, 'combobox-menu')}
                onClick={handleClick}
            >
                {options.map(option => {
                    const selected = values.includes(option.props.value);

                    return cloneElement(option, {
                        className: classNames(option.props.className, selected && 'selected'),
                        'aria-selected': selected
                    });
                })}
            </Menu>
            {values.map(item => (
                <input key={item} type="hidden" name={name} value={item} />
            ))}
        </div>
    );
};

Combobox.displayName = 'Combobox';

export type DatePickerProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
    enhanced?: boolean;
    inline?: boolean;
    selectionMode?: 'single' | 'multiple' | 'multiple-ranged';
};

export const DatePicker: FC<DatePickerProps> = ({
    className,
    enhanced,
    inline,
    selectionMode,
    ...props
}) => (
    <input
        {...props}
        type={enhanced ? 'text' : 'date'}
        className={classNames('form-control', className)}
        data-bs-toggle={enhanced ? 'datepicker' : undefined}
        data-bs-inline={enhanced ? inline || undefined : undefined}
        data-bs-selection-mode={enhanced ? selectionMode : undefined}
    />
);

DatePicker.displayName = 'DatePicker';

export type OtpInputProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'maxLength'> & {
    length: number;
    type?: 'numeric' | 'alphanumeric' | 'alpha';
    mask?: boolean;
    groups?: number[];
    separator?: string;
    connected?: boolean;
    size?: 'sm' | 'lg';
};

export const OtpInput: FC<OtpInputProps> = ({
    className,
    length,
    type = 'numeric',
    mask,
    groups,
    separator,
    connected,
    size,
    ...props
}) => (
    <div
        className={classNames('otp', connected && 'otp-connected', size && `otp-${size}`)}
        data-bs-otp=""
        data-bs-length={length}
        data-bs-type={type}
        data-bs-mask={mask || undefined}
        data-bs-groups={groups ? JSON.stringify(groups) : undefined}
        data-bs-separator={separator}
    >
        <input
            {...props}
            type="text"
            maxLength={length}
            autoComplete={props.autoComplete || 'one-time-code'}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            pattern={
                type === 'numeric' ? '[0-9]*' : type === 'alpha' ? '[a-zA-Z]*' : '[a-zA-Z0-9]*'
            }
            className={classNames('otp-input', className)}
        />
    </div>
);

OtpInput.displayName = 'OtpInput';

export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

export const getPasswordStrength = (
    password: string,
    minLength = 8
): PasswordStrengthLevel | null => {
    const score = [
        password.length >= minLength,
        password.length >= minLength + 4,
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /\d/.test(password),
        /[^A-Za-z0-9]/.test(password),
        (password.match(/[^A-Za-z0-9]/g)?.length || 0) > 1,
        password.length >= 16
    ].filter(Boolean).length;

    return score === 0
        ? null
        : score <= 2
          ? 'weak'
          : score <= 4
            ? 'fair'
            : score <= 6
              ? 'good'
              : 'strong';
};

export interface PasswordStrengthProps extends ComponentPropsWithRef<'div'> {
    value: string;
    minLength?: number;
    messages?: Partial<Record<PasswordStrengthLevel, ReactNode>>;
    variant?: 'segments' | 'bar';
}

export const PasswordStrength: FC<PasswordStrengthProps> = ({
    className,
    value,
    minLength,
    messages,
    variant = 'segments',
    ...props
}) => {
    const strength = getPasswordStrength(value, minLength);
    const levels: PasswordStrengthLevel[] = ['weak', 'fair', 'good', 'strong'];
    const activeCount = strength ? levels.indexOf(strength) + 1 : 0;

    return variant === 'bar' ? (
        <div
            {...props}
            className={classNames('strength-bar', className)}
            data-bs-strength={strength || undefined}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={activeCount}
            aria-valuetext={strength || 'Empty'}
        />
    ) : (
        <div
            {...props}
            className={classNames('strength', className)}
            data-bs-strength={strength || undefined}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={activeCount}
            aria-valuetext={strength || 'Empty'}
        >
            {levels.map((level, index) => (
                <div
                    key={level}
                    className={classNames('strength-segment', index < activeCount && 'active')}
                />
            ))}
            {strength && <span className="strength-text">{messages?.[strength] || strength}</span>}
        </div>
    );
};

PasswordStrength.displayName = 'PasswordStrength';
