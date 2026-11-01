'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import type { ComponentTheme } from '../Button';

export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> & {
    size?: 'sm' | 'lg';
    theme?: ComponentTheme;
};

export const Checkbox: FC<CheckboxProps> = ({ className, size, theme, ...props }) => (
    <input
        {...props}
        type="checkbox"
        className={classNames(
            'check',
            size && `check-${size}`,
            theme && `theme-${theme}`,
            className
        )}
    />
);

Checkbox.displayName = 'Checkbox';
