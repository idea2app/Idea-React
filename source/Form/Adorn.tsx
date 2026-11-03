import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import { Icon, IconProps } from '../Extension/Icon';
import { FormValidationProps } from './Primitives';

export type FormAdornmentProps = Omit<ComponentPropsWithRef<'label'>, 'htmlFor'> &
    FormValidationProps & {
        end?: boolean;
        size?: 'sm' | 'lg';
        htmlFor?: string;
    };

export const FormAdornment: FC<FormAdornmentProps> = ({
    className,
    end,
    size,
    validation,
    ...props
}) => (
    <label
        {...props}
        className={classNames(
            'form-control form-adorn',
            end && 'form-adorn-end',
            size && `form-control-${size}`,
            validation && `is-${validation}`,
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

export const FormAdornmentIcon: FC<IconProps> = ({ className, ...props }) => (
    <Icon {...props} className={classNames('form-adorn-icon', className)} />
);

FormAdornmentIcon.displayName = 'FormAdornmentIcon';

export type FormGhostProps = ComponentPropsWithRef<'input'> & FormValidationProps;

export const FormGhost: FC<FormGhostProps> = ({ className, validation, ...props }) => (
    <input
        {...props}
        aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
        className={classNames('form-ghost', validation && `is-${validation}`, className)}
    />
);

FormGhost.displayName = 'FormGhost';
