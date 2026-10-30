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

const isBadgeLink = (props: BadgeElementAttributes): props is BadgeLinkAttributes =>
    typeof props.href === 'string';

export const Badge: FC<BadgeProps> = ({ variant = 'solid', theme, pill, className, ...props }) => {
    const classes = classNames(
        'badge',
        variant !== 'solid' && `badge-${variant}`,
        theme && `theme-${theme}`,
        { 'rounded-pill': pill },
        className
    );

    return isBadgeLink(props) ? (
        <a {...props} className={classes} />
    ) : (
        <span {...props} className={classes} />
    );
};
