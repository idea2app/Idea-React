import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import { FormValidationProps } from './Primitives';

const CONTROL_SIZES = {
    sm: 'form-control-sm',
    lg: 'form-control-lg'
} as const;

export type FormControlProps = Omit<ComponentPropsWithRef<'input'>, 'color'> &
    FormValidationProps & {
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
    validation,
    ...props
}) => (
    <input
        {...props}
        aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
        className={classNames(
            ghost ? 'form-ghost' : plaintext ? 'form-control-plaintext' : 'form-control',
            !ghost && caret && 'form-control-caret',
            !ghost && !plaintext && color && 'form-control-color',
            !ghost && !plaintext && controlSize && CONTROL_SIZES[controlSize],
            validation && `is-${validation}`,
            className
        )}
    />
);

FormControl.displayName = 'FormControl';

export type FormTextAreaProps = ComponentPropsWithRef<'textarea'> &
    FormValidationProps & {
        controlSize?: 'sm' | 'lg';
    };

export const FormTextArea: FC<FormTextAreaProps> = ({
    className,
    controlSize,
    validation,
    ...props
}) => (
    <textarea
        {...props}
        aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
        className={classNames(
            'form-control',
            controlSize && CONTROL_SIZES[controlSize],
            validation && `is-${validation}`,
            className
        )}
    />
);

FormTextArea.displayName = 'FormTextArea';

export type FormSelectProps = ComponentPropsWithRef<'select'> &
    FormValidationProps & {
        controlSize?: 'sm' | 'lg';
    };

export const FormSelect: FC<FormSelectProps> = ({
    className,
    controlSize,
    validation,
    ...props
}) => (
    <select
        {...props}
        aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
        className={classNames(
            'form-control',
            controlSize && CONTROL_SIZES[controlSize],
            validation && `is-${validation}`,
            className
        )}
    />
);

FormSelect.displayName = 'FormSelect';
