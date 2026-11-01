'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

const CONTROL_SIZES = {
    sm: 'form-control-sm',
    lg: 'form-control-lg'
} as const;

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

export type FormSelectProps = ComponentPropsWithRef<'select'> & {
    controlSize?: 'sm' | 'lg';
};

export const FormSelect: FC<FormSelectProps> = ({ className, controlSize, ...props }) => (
    <select
        {...props}
        className={classNames('form-control', controlSize && CONTROL_SIZES[controlSize], className)}
    />
);

FormSelect.displayName = 'FormSelect';
