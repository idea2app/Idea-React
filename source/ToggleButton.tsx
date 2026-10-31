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
    className,
    children,
    ...props
}) => (
    <label
        {...props}
        className={classNames('btn-check', `btn-${variant}`, theme && `theme-${theme}`, className)}
    >
        <input
            type={type}
            name={name}
            value={value}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            autoComplete="off"
        />
        {children}
    </label>
);

ToggleButton.displayName = 'ToggleButton';
