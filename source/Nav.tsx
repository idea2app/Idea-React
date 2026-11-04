import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from './Polymorphic';

export interface NavProps extends ComponentPropsWithRef<'nav'> {
    variant?: 'tabs' | 'pills' | 'underline';
    vertical?: boolean;
    fill?: boolean;
    justified?: boolean;
    cardHeader?: boolean;
    navbar?: boolean;
}

export const Nav = polymorphic<NavProps>(
    ({
        as: Root = 'nav',
        variant,
        vertical,
        fill,
        justified,
        cardHeader,
        navbar,
        className,
        ...props
    }) => (
        <Root
            {...props}
            className={classNames(
                'nav',
                navbar && 'navbar-nav',
                variant && `nav-${variant}`,
                cardHeader && variant === 'tabs' && 'card-header-tabs',
                vertical && (variant === 'pills' ? 'nav-pills-vertical' : 'flex-column'),
                { 'nav-fill': fill, 'nav-justified': justified },
                className
            )}
        />
    )
);
Nav.displayName = 'Nav';

export const NavItem = polymorphic<ComponentPropsWithRef<'li'>>(
    ({ as: Root = 'li', className, ...props }) => (
        <Root {...props} className={classNames('nav-item', className)} />
    )
);
NavItem.displayName = 'NavItem';

export interface NavLinkProps extends ComponentPropsWithRef<'a'> {
    disabled?: boolean;
    active?: boolean;
}

export const NavLink = polymorphic<NavLinkProps>(
    ({ as: Root = 'a', disabled, active, className, href, onClick, tabIndex, ...props }) => (
        <Root
            {...props}
            href={disabled ? undefined : href}
            tabIndex={disabled ? -1 : tabIndex}
            aria-disabled={disabled || undefined}
            aria-current={active ? 'page' : props['aria-current']}
            className={classNames('nav-link', { active, disabled, 'pe-none': disabled }, className)}
            onClick={disabled ? undefined : onClick}
        />
    )
);
NavLink.displayName = 'NavLink';
