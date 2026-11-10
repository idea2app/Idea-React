import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';

export type IconProps = ComponentPropsWithRef<'span'> & {
    name: string;
    size?: number;
};
export const Icon = polymorphic<IconProps>(
    ({
        as: Root = 'span',
        className,
        style,
        name,
        size,
        'aria-hidden': ariaHidden,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        ...props
    }) => (
        <Root
            {...props}
            className={classNames(`bi-${name}`, className)}
            style={{ fontSize: size && `${size}rem`, ...style }}
            aria-hidden={ariaHidden ?? (ariaLabel || ariaLabelledBy ? undefined : true)}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
        />
    )
);
Icon.displayName = 'Icon';
