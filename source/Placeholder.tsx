import classNames from 'classnames';
import { ComponentPropsWithRef, CSSProperties, FC } from 'react';

import { Button, ButtonProps, ComponentTheme } from './Button';

export interface PlaceholderProps extends ComponentPropsWithRef<'span'> {
    size?: 'xs' | 'sm' | 'lg';
    animation?: 'wave' | 'pulse' | 'glow';
    theme?: ComponentTheme;
    width?: CSSProperties['width'];
}

export const Placeholder: FC<PlaceholderProps> = ({
    size,
    animation,
    theme,
    width,
    className,
    style,
    'aria-hidden': hidden = true,
    ...props
}) => (
    <span
        {...props}
        className={classNames(
            'placeholder',
            size && `placeholder-${size}`,
            animation && `placeholder-${animation}`,
            theme && `bg-${theme}`,
            className
        )}
        style={{ width, ...style }}
        aria-hidden={hidden}
    />
);

export interface PlaceholderAnimationProps extends ComponentPropsWithRef<'div'> {
    animation?: PlaceholderProps['animation'];
}

export const PlaceholderAnimation: FC<PlaceholderAnimationProps> = ({
    animation = 'wave',
    className,
    ...props
}) => (
    <div
        {...props}
        className={classNames(`placeholder-${animation}`, className)}
        aria-hidden="true"
    />
);

export type PlaceholderButtonProps = ButtonProps;

export const PlaceholderButton: FC<PlaceholderButtonProps> = ({ className, ...props }) => (
    <Button
        {...props}
        className={classNames('placeholder', className)}
        aria-hidden="true"
        disabled
    />
);

Placeholder.displayName = 'Placeholder';
PlaceholderAnimation.displayName = 'PlaceholderAnimation';
PlaceholderButton.displayName = 'PlaceholderButton';
