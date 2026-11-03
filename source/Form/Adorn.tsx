import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { Icon, IconProps } from '../Extension/Icon';
import { polymorphic } from '../Polymorphic';
import { FormValidationProps } from './Primitives';

export type FormAdornmentProps = Omit<ComponentPropsWithRef<'label'>, 'htmlFor'> &
    FormValidationProps & {
        end?: boolean;
        size?: 'sm' | 'lg';
        htmlFor?: string;
    };

export const FormAdornment = polymorphic<FormAdornmentProps>(
    ({ as: Root = 'label', className, end, size, validation, ...props }) => (
        <Root
            {...props}
            className={classNames(
                'form-control form-adorn',
                end && 'form-adorn-end',
                size && `form-control-${size}`,
                validation && `is-${validation}`,
                className
            )}
        />
    )
);

FormAdornment.displayName = 'FormAdornment';

export type FormAdornmentTextProps = ComponentPropsWithRef<'span'>;

export const FormAdornmentText = polymorphic<FormAdornmentTextProps>(
    ({ as: Root = 'span', className, ...props }) => (
        <Root {...props} className={classNames('form-adorn-text', className)} />
    )
);

FormAdornmentText.displayName = 'FormAdornmentText';

export const FormAdornmentIcon = polymorphic<IconProps>(({ as: RootAs, className, ...props }) => (
    <Icon as={RootAs} {...props} className={classNames('form-adorn-icon', className)} />
));

FormAdornmentIcon.displayName = 'FormAdornmentIcon';

export type FormGhostProps = ComponentPropsWithRef<'input'> & FormValidationProps;

export const FormGhost = polymorphic<FormGhostProps>(
    ({ as: Root = 'input', className, validation, ...props }) => (
        <Root
            {...props}
            aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
            className={classNames('form-ghost', validation && `is-${validation}`, className)}
        />
    )
);

FormGhost.displayName = 'FormGhost';
