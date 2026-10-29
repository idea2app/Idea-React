import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import type { ComponentTheme } from './Button';

interface BadgeStyleProps {
    variant?: 'solid' | 'subtle' | 'outline';
    theme?: ComponentTheme;
    pill?: boolean;
}

type BadgeLinkAttributes = ComponentPropsWithRef<'a'> & { href: string };
type BadgeElementAttributes =
    (ComponentPropsWithRef<'span'> & { href?: never }) | BadgeLinkAttributes;
export type BadgeProps = BadgeStyleProps & BadgeElementAttributes;

function isBadgeLink(props: BadgeElementAttributes): props is BadgeLinkAttributes {
    return typeof props.href === 'string';
}

export const Badge: FC<BadgeProps> = ({ variant = 'solid', theme, pill, className, ...props }) => {
    const classes = classNames(
        'badge',
        variant !== 'solid' && `badge-${variant}`,
        theme && `theme-${theme}`,
        { 'rounded-pill': pill },
        className
    );

    if (isBadgeLink(props)) {
        return <a {...props} className={classes} />;
    }
    return <span {...props} className={classes} />;
};
