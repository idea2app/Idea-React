import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import type { ComponentTheme } from './Button';
import { polymorphic } from './Polymorphic';

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

export const Badge = polymorphic<BadgeProps>(
    ({ as: RootAs, variant = 'solid', theme, pill, className, ...props }) => {
        const Root = RootAs ?? (isBadgeLink(props) ? 'a' : 'span');
        const classes = classNames(
            'badge',
            variant !== 'solid' && `badge-${variant}`,
            theme && `theme-${theme}`,
            { 'rounded-pill': pill },
            className
        );

        return <Root {...props} className={classes} />;
    }
);
Badge.displayName = 'Badge';
