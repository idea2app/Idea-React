import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Polymorphic';
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

export const FormControl = polymorphic<FormControlProps>(
    ({
        as: Root = 'input',
        className,
        plaintext,
        ghost,
        caret,
        color,
        controlSize,
        validation,
        ...props
    }) => (
        <Root
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
    )
);

FormControl.displayName = 'FormControl';

export type FormTextAreaProps = ComponentPropsWithRef<'textarea'> &
    FormValidationProps & {
        controlSize?: 'sm' | 'lg';
    };

export const FormTextArea = polymorphic<FormTextAreaProps>(
    ({ as: Root = 'textarea', className, controlSize, validation, ...props }) => (
        <Root
            {...props}
            aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
            className={classNames(
                'form-control',
                controlSize && CONTROL_SIZES[controlSize],
                validation && `is-${validation}`,
                className
            )}
        />
    )
);

FormTextArea.displayName = 'FormTextArea';

export type FormSelectProps = ComponentPropsWithRef<'select'> &
    FormValidationProps & {
        controlSize?: 'sm' | 'lg';
    };

export const FormSelect = polymorphic<FormSelectProps>(
    ({ as: Root = 'select', className, controlSize, validation, ...props }) => (
        <Root
            {...props}
            aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
            className={classNames(
                'form-control',
                controlSize && CONTROL_SIZES[controlSize],
                validation && `is-${validation}`,
                className
            )}
        />
    )
);

FormSelect.displayName = 'FormSelect';
