import classNames from 'classnames';
import { ComponentPropsWithRef, CSSProperties, HTMLAttributes } from 'react';

import { polymorphic } from '../Helper/Polymorphic';
import type { ComponentTheme } from './Button';

export type AvatarSize = 'xs' | 'sm' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
    /**
     * Official size class name suffix, or a custom size in `rem`
     * applied through the `--bs-avatar-size` CSS variable
     */
    size?: AvatarSize | number;
    theme?: ComponentTheme;
    subtle?: boolean;
    src?: string;
    alt?: string;
    status?: AvatarStatus;
    statusLabel?: string;
}

export const Avatar = polymorphic<AvatarProps>(
    ({
        as: Root = 'span',
        className,
        style,
        size,
        theme,
        subtle,
        src,
        alt,
        status,
        statusLabel = status,
        children,
        ...props
    }) => (
        <Root
            className={classNames(
                'avatar',
                typeof size === 'string' && `avatar-${size}`,
                theme && `theme-${theme}`,
                subtle && 'avatar-subtle',
                className
            )}
            style={
                typeof size === 'number'
                    ? ({ '--bs-avatar-size': `${size}rem`, ...style } as CSSProperties)
                    : style
            }
            {...props}
        >
            {src ? <img className="avatar-img" src={src} alt={alt} /> : children}

            {status && (
                <span
                    className={`avatar-status status-${status}`}
                    role="img"
                    aria-label={statusLabel}
                />
            )}
        </Root>
    )
);
Avatar.displayName = 'Avatar';

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
    size?: AvatarSize;
}

export const AvatarImage = polymorphic<ComponentPropsWithRef<'img'>>(
    ({ as: Root = 'img', className, ...props }) => (
        <Root {...props} className={classNames('avatar-img', className)} />
    )
);
AvatarImage.displayName = 'AvatarImage';

export const AvatarStack = polymorphic<AvatarStackProps>(
    ({ as: Root = 'div', className, size, children, ...props }) => (
        <Root
            className={classNames('avatar-stack', size && `avatar-stack-${size}`, className)}
            {...props}
        >
            {children}
        </Root>
    )
);
AvatarStack.displayName = 'AvatarStack';
