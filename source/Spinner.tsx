import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import type { ComponentTheme } from './Button';
import { Icon, IconProps } from './Icon';

export type SpinnerAnimation = 'border' | 'grow';

export interface SpinnerProps extends ComponentPropsWithRef<'span'> {
    animation?: SpinnerAnimation;
    size?: 'sm';
    theme?: ComponentTheme;
}

export const Spinner: FC<SpinnerProps> = ({
    animation = 'border',
    size,
    theme,
    className,
    role = 'status',
    ...props
}) => (
    <span
        {...props}
        role={role}
        className={classNames(
            `spinner-${animation}`,
            size && `spinner-${size}`,
            theme && `theme-${theme}`,
            className
        )}
    />
);

export const SpinnerIcon: FC<IconProps> = ({ className, ...props }) => (
    <Icon {...props} className={classNames('spinner-rotate', className)} />
);

SpinnerIcon.displayName = 'SpinnerIcon';
