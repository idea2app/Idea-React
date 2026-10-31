import classNames from 'classnames';
import { CSSProperties, FC, HTMLAttributes } from 'react';

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

export const Avatar: FC<AvatarProps> = ({
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
    <span
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
    </span>
);

Avatar.displayName = 'Avatar';

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
    size?: AvatarSize;
}

export const AvatarStack: FC<AvatarStackProps> = ({ className, size, children, ...props }) => (
    <div
        className={classNames('avatar-stack', size && `avatar-stack-${size}`, className)}
        {...props}
    >
        {children}
    </div>
);

AvatarStack.displayName = 'AvatarStack';
