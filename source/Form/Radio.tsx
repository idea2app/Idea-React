import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import type { ComponentTheme } from '../Button';
import { Checkbox, CheckboxProps } from './Checkbox';
import { FormValidationProps } from './Primitives';

export type RadioProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> &
    FormValidationProps & {
        size?: 'sm' | 'lg';
        theme?: ComponentTheme;
    };

export const Radio: FC<RadioProps> = ({ className, size, theme, validation, ...props }) => (
    <input
        {...props}
        type="radio"
        aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
        className={classNames(
            'radio',
            size && `radio-${size}`,
            theme && `theme-${theme}`,
            validation && `is-${validation}`,
            className
        )}
    />
);

Radio.displayName = 'Radio';

export type FormCheckProps = CheckboxProps &
    Pick<ComponentPropsWithRef<'input'>, 'ref'> & {
        type?: 'checkbox' | 'radio';
    };

export const FormCheck: FC<FormCheckProps> = ({ type = 'checkbox', indeterminate, ...props }) =>
    type === 'checkbox' ? (
        <Checkbox {...props} indeterminate={indeterminate} />
    ) : (
        <Radio {...props} />
    );

FormCheck.displayName = 'FormCheck';
