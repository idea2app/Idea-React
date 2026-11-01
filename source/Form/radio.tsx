'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import type { ComponentTheme } from '../Button';

export type RadioProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> & {
    size?: 'sm' | 'lg';
    theme?: ComponentTheme;
};

export const Radio: FC<RadioProps> = ({ className, size, theme, ...props }) => (
    <input
        {...props}
        type="radio"
        className={classNames(
            'radio',
            size && `radio-${size}`,
            theme && `theme-${theme}`,
            className
        )}
    />
);

Radio.displayName = 'Radio';

export type FormCheckProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> & {
    type?: 'checkbox' | 'radio';
    size?: 'sm' | 'lg';
    theme?: ComponentTheme;
};

export const FormCheck: FC<FormCheckProps> = ({
    className,
    type = 'checkbox',
    size,
    theme,
    ...props
}) => (
    <input
        {...props}
        type={type}
        className={classNames(
            type === 'checkbox' ? 'check' : 'radio',
            size && `${type === 'checkbox' ? 'check' : 'radio'}-${size}`,
            theme && `theme-${theme}`,
            className
        )}
    />
);

FormCheck.displayName = 'FormCheck';
