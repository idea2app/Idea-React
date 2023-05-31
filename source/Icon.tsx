import classNames from 'classnames';
import { FC, HTMLAttributes, PropsWithRef } from 'react';

export type IconProps = PropsWithRef<
    HTMLAttributes<HTMLSpanElement> & {
        name: string;
        size?: number;
    }
>;
export const Icon: FC<IconProps> = ({
    className,
    style,
    name,
    size,
    ...props
}) => (
    <i
        className={classNames(`bi-${name}`, className)}
        style={{ fontSize: size && `${size}rem`, ...style }}
        {...props}
    />
);

Icon.displayName = 'Icon';
