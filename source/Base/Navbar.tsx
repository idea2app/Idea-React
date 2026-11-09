import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';
import { Button } from './Button';

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
Navbar.displayName = 'Navbar';

export type NavbarBrandProps =
    (ComponentPropsWithRef<'a'> & { as?: 'a' }) | (ComponentPropsWithRef<'span'> & { as: 'span' });

export const NavbarBrand = polymorphic<ComponentPropsWithRef<'a'>>(
    ({ as: Root = 'a', className, ...props }) => (
        <Root {...props} className={classNames('navbar-brand', className)} />
    )
);
NavbarBrand.displayName = 'NavbarBrand';

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
NavbarNav.displayName = 'NavbarNav';

export const NavbarText = polymorphic<ComponentPropsWithRef<'span'>>(
    ({ as: Root = 'span', className, ...props }) => (
        <Root {...props} className={classNames('navbar-text', className)} />
    )
);
NavbarText.displayName = 'NavbarText';

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
    }) => {
        const icon = <span className="navbar-toggler-icon" aria-hidden="true" />;
        const togglerClassName = classNames('navbar-toggler', className);

        return (
            <Button
                as={RootAs}
                {...props}
                className={togglerClassName}
                aria-label={ariaLabel}
                aria-expanded={expanded}
                icon
            >
                {icon}
            </Button>
        );
    }
);
NavbarToggler.displayName = 'NavbarToggler';
