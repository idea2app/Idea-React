import classNames from 'classnames';
import { ComponentPropsWithRef, CSSProperties } from 'react';

import { Button, ButtonProps, ComponentTheme } from './Button';
import { polymorphic } from './Polymorphic';

export interface PlaceholderProps extends ComponentPropsWithRef<'span'> {
    size?: 'xs' | 'sm' | 'lg';
    animation?: 'wave' | 'pulse' | 'glow';
    theme?: ComponentTheme;
    width?: CSSProperties['width'];
}

export const Placeholder = polymorphic<PlaceholderProps>(
    ({
        as: Root = 'span',
        size,
        animation,
        theme,
        width,
        className,
        style,
        'aria-hidden': hidden = true,
        ...props
    }) => (
        <Root
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
    )
);

export interface PlaceholderAnimationProps extends ComponentPropsWithRef<'div'> {
    animation?: PlaceholderProps['animation'];
}

export const PlaceholderAnimation = polymorphic<PlaceholderAnimationProps>(
    ({ as: Root = 'div', animation = 'wave', className, ...props }) => (
        <Root
            {...props}
            className={classNames(`placeholder-${animation}`, className)}
            aria-hidden="true"
        />
    )
);

export type PlaceholderButtonProps = ButtonProps;

export const PlaceholderButton = polymorphic<PlaceholderButtonProps>(
    ({ as: RootAs, className, ...props }) => (
        <Button
            as={RootAs}
            {...props}
            className={classNames('placeholder', className)}
            aria-hidden="true"
            disabled
        />
    )
);

Placeholder.displayName = 'Placeholder';
PlaceholderAnimation.displayName = 'PlaceholderAnimation';
PlaceholderButton.displayName = 'PlaceholderButton';
