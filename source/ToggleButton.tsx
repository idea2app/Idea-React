import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import type { ComponentTheme } from './Button';

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

export const ToggleButton: FC<ToggleButtonProps> = ({
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
    <label
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
            type={type}
            name={name}
            value={value}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            autoComplete="off"
            onChange={onChange}
        />
        {children}
    </label>
);

ToggleButton.displayName = 'ToggleButton';
