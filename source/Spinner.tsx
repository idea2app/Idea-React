import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import type { ComponentTheme } from './Button';

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
    ...props
}) => (
    <span
        {...props}
        className={classNames(
            `spinner-${animation}`,
            size && `spinner-${size}`,
            theme && `theme-${theme}`,
            className
        )}
    />
);
