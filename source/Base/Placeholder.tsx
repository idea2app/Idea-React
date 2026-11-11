import classNames from 'classnames';
import { ComponentPropsWithRef, CSSProperties } from 'react';

import { polymorphic } from '../Helper/Polymorphic';
import { Button, ButtonProps, ComponentTheme } from './Button';

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
                animation ? `placeholder-${animation}` : 'placeholder',
                !animation && size && `placeholder-${size}`,
                !animation && theme && `bg-${theme}`,
                className
            )}
            style={{ width: animation ? undefined : width, ...style }}
            aria-hidden={hidden}
        />
    )
);
Placeholder.displayName = 'Placeholder';

export type PlaceholderButtonProps = ButtonProps;

export const PlaceholderButton = polymorphic<PlaceholderButtonProps>(
    ({ as: RootAs, className, children = '\u00a0', ...props }) => (
        <Button
            as={RootAs}
            {...props}
            className={classNames('placeholder', className)}
            aria-hidden="true"
            disabled
        >
            {children}
        </Button>
    )
);
PlaceholderButton.displayName = 'PlaceholderButton';
