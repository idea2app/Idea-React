import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import type { ComponentTheme } from '../Base/Button';
import { polymorphic } from '../Helper/Polymorphic';
import { Checkbox, CheckboxProps } from './Checkbox';
import { FormValidationProps } from './Primitives';

export type RadioProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> &
    FormValidationProps & {
        size?: 'sm' | 'lg';
        theme?: ComponentTheme;
    };

export const Radio = polymorphic<RadioProps>(
    ({ as: Root = 'input', className, size, theme, validation, ...props }) => (
        <Root
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
    )
);
Radio.displayName = 'Radio';

export type FormCheckProps = CheckboxProps &
    Pick<ComponentPropsWithRef<'input'>, 'ref'> & {
        type?: 'checkbox' | 'radio';
    };

export const FormCheck = polymorphic<FormCheckProps>(
    ({ as: RootAs, type = 'checkbox', indeterminate, ...props }) =>
        type === 'checkbox' ? (
            <Checkbox as={RootAs} {...props} indeterminate={indeterminate} />
        ) : (
            <Radio as={RootAs} {...props} />
        )
);
FormCheck.displayName = 'FormCheck';
