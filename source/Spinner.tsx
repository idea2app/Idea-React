import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import type { ComponentTheme } from './Button';
import { Icon, IconProps } from './Extension/Icon';
import { polymorphic } from './Polymorphic';

export type SpinnerAnimation = 'border' | 'grow';

export interface SpinnerProps extends ComponentPropsWithRef<'span'> {
    animation?: SpinnerAnimation;
    size?: 'sm';
    theme?: ComponentTheme;
}

export const Spinner = polymorphic<SpinnerProps>(
    ({
        as: Root = 'span',
        animation = 'border',
        size,
        theme,
        className,
        role = 'status',
        ...props
    }) => (
        <Root
            {...props}
            role={role}
            className={classNames(
                `spinner-${animation}`,
                size && `spinner-${size}`,
                theme && `theme-${theme}`,
                className
            )}
        />
    )
);

export const SpinnerIcon = polymorphic<IconProps>(({ as: RootAs, className, ...props }) => (
    <Icon as={RootAs} {...props} className={classNames('spinner-rotate', className)} />
));

Spinner.displayName = 'Spinner';
SpinnerIcon.displayName = 'SpinnerIcon';

Spinner.displayName = 'Spinner';
