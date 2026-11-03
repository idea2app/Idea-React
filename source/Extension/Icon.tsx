import classNames from 'classnames';
import { HTMLAttributes, PropsWithRef } from 'react';

import { polymorphic } from '../Polymorphic';

export type IconProps = PropsWithRef<
    HTMLAttributes<HTMLSpanElement> & {
        name: string;
        size?: number;
    }
>;
export const Icon = polymorphic<IconProps>(
    ({ as: Root = 'span', className, style, name, size, ...props }) => (
        <Root
            className={classNames(`bi-${name}`, className)}
            style={{ fontSize: size && `${size}rem`, ...style }}
            {...props}
        />
    )
);

Icon.displayName = 'Icon';
