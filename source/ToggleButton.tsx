import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import type { ComponentTheme } from './Button';
import { polymorphic } from './Polymorphic';

export interface ToggleButtonProps extends Omit<ComponentPropsWithRef<'label'>, 'onChange'> {
    type?: 'checkbox' | 'radio';
    variant?: 'solid' | 'outline' | 'subtle' | 'text';
    theme?: ComponentTheme;
    name?: string;
    value?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    required?: boolean;
    size?: 'xs' | 'sm' | 'lg';
    inputProps?: Omit<
        ComponentPropsWithRef<'input'>,
        'type' | 'name' | 'value' | 'checked' | 'defaultChecked' | 'disabled' | 'required'
    >;
    onChange?: ComponentPropsWithRef<'input'>['onChange'];
}

export const ToggleButton = polymorphic<ToggleButtonProps>(
    ({
        as: Root = 'label',
        type = 'checkbox',
        variant = 'solid',
        theme,
        name,
        value,
        checked,
        defaultChecked,
        disabled,
        required,
        size,
        inputProps,
        onChange,
        className,
        children,
        ...props
    }) => (
        <Root
            {...props}
            className={classNames(
                'btn-check',
                `btn-${variant}`,
                theme && `theme-${theme}`,
                size && `btn-${size}`,
                className
            )}
        >
            <input
                {...inputProps}
                {...{ type, name, value, checked, defaultChecked, disabled, required }}
                autoComplete="off"
                onChange={onChange}
            />
            {children}
        </Root>
    )
);

ToggleButton.displayName = 'ToggleButton';
