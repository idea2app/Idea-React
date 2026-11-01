'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC, PropsWithChildren } from 'react';

import type { ComponentTheme } from '../Button';

export type FormSwitchProps = Omit<ComponentPropsWithRef<'label'>, 'children'> &
    PropsWithChildren<{
        inputProps?: Omit<ComponentPropsWithRef<'input'>, 'type'>;
        size?: 'sm' | 'lg';
        theme?: ComponentTheme;
    }>;

export const FormSwitch: FC<FormSwitchProps> = ({
    className,
    inputProps,
    size,
    theme,
    children,
    ...props
}) => (
    <label
        {...props}
        className={classNames(
            'switch',
            size && `switch-${size}`,
            theme && `theme-${theme}`,
            className
        )}
    >
        <input {...inputProps} type="checkbox" />
        {children}
    </label>
);

FormSwitch.displayName = 'FormSwitch';
