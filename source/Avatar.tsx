import React, { CSSProperties, PropsWithoutRef } from 'react';

export type AvatarProps = PropsWithoutRef<{
    style?: CSSProperties;
    src?: string;
    size?: number;
}>;

export function Avatar({
    style,
    src = '/typescript.png',
    size = 3
}: AvatarProps) {
    return (
        <img
            className="rounded-circle"
            style={{
                width: `${size}rem`,
                height: `${size}rem`,
                objectFit: 'cover',
                ...style
            }}
            src={src}
        />
    );
}
