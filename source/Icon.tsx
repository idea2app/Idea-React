import React, { HTMLAttributes, PropsWithRef } from 'react';
import classNames from 'classnames';

export type IconProps = PropsWithRef<
    HTMLAttributes<HTMLSpanElement> & {
        name: string;
        size?: number;
    }
>;
export function Icon({
    className,
    style,
    name,
    size = 1,
    ...props
}: IconProps) {
    return (
        <i
            className={classNames(`bi-${name}`, className)}
            style={{ fontSize: `${size}rem`, ...style }}
            {...props}
        />
    );
}
