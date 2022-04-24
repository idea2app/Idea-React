import classNames from 'classnames';
import React, { CSSProperties, FC, PropsWithoutRef } from 'react';

export type AvatarProps = PropsWithoutRef<{
    style?: CSSProperties;
    className?: string;
    src?: string;
    size?: number;
}>;

export const Avatar: FC<AvatarProps> = ({
    style,
    className,
    src = '/typescript.png',
    size = 3
}) => (
    <img
        className={classNames(className, 'rounded-circle')}
        style={{
            width: `${size}rem`,
            height: `${size}rem`,
            objectFit: 'cover',
            ...style
        }}
        src={src}
    />
);

Avatar.displayName = 'Avatar';
