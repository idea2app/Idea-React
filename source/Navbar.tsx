import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { Button } from './Button';
import { polymorphic } from './Polymorphic';

export interface NavbarProps extends ComponentPropsWithRef<'nav'> {
    theme?: 'light' | 'dark';
    expand?: boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    translucent?: boolean;
}

export const Navbar = polymorphic<NavbarProps>(
    ({ as: Root = 'nav', expand, theme, translucent, className, ...props }) => (
        <Root
            {...props}
            className={classNames(
                'navbar',
                translucent && 'navbar-translucent',
                expand && (expand === true ? 'navbar-expand' : `${expand}:navbar-expand`),
                className
            )}
            data-bs-theme={theme}
        />
    )
);

export type NavbarBrandProps =
    (ComponentPropsWithRef<'a'> & { as?: 'a' }) | (ComponentPropsWithRef<'span'> & { as: 'span' });

export const NavbarBrand = polymorphic<ComponentPropsWithRef<'a'>>(
    ({ as: Root = 'a', className, ...props }) => (
        <Root {...props} className={classNames('navbar-brand', className)} />
    )
);

export interface NavbarNavProps extends ComponentPropsWithRef<'ul'> {
    variant?: 'tabs' | 'pills' | 'underline';
    nav?: boolean;
}

export const NavbarNav = polymorphic<NavbarNavProps>(
    ({ as: Root = 'ul', variant, nav, className, ...props }) => (
        <Root
            {...props}
            className={classNames(
                'navbar-nav',
                (nav || variant) && 'nav',
                variant && `nav-${variant}`,
                className
            )}
        />
    )
);

export const NavbarText = polymorphic<ComponentPropsWithRef<'span'>>(
    ({ as: Root = 'span', className, ...props }) => (
        <Root {...props} className={classNames('navbar-text', className)} />
    )
);

export interface NavbarTogglerProps extends Omit<
    ComponentPropsWithRef<'button'>,
    'children' | 'type'
> {
    expanded?: boolean;
}

export const NavbarToggler = polymorphic<NavbarTogglerProps>(
    ({
        as: RootAs,
        expanded,
        className,
        'aria-label': ariaLabel = 'Toggle navigation',
        ...props
    }) => (
        <Button
            as={RootAs}
            {...props}
            type="button"
            className={classNames('navbar-toggler', className)}
            aria-label={ariaLabel}
            aria-expanded={expanded}
            icon
        >
            <span className="navbar-toggler-icon" aria-hidden="true" />
        </Button>
    )
);

Navbar.displayName = 'Navbar';
NavbarBrand.displayName = 'NavbarBrand';
NavbarNav.displayName = 'NavbarNav';
NavbarText.displayName = 'NavbarText';
NavbarToggler.displayName = 'NavbarToggler';
