import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';

export type IconProps = ComponentPropsWithRef<'span'> & {
    name: string;
    size?: number;
};
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
