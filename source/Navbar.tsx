import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import { Button } from './Button';

export interface NavbarProps extends ComponentPropsWithRef<'nav'> {
    expand?: boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    theme?: 'light' | 'dark';
}

export const Navbar: FC<NavbarProps> = ({ expand, theme, className, ...props }) => (
    <nav
        {...props}
        className={classNames(
            'navbar',
            expand && (expand === true ? 'navbar-expand' : `${expand}:navbar-expand`),
            className
        )}
        data-bs-theme={theme}
    />
);

export const NavbarBrand: FC<ComponentPropsWithRef<'a'>> = ({ className, ...props }) => (
    <a {...props} className={classNames('navbar-brand', className)} />
);

export const NavbarNav: FC<ComponentPropsWithRef<'ul'>> = ({ className, ...props }) => (
    <ul {...props} className={classNames('navbar-nav', className)} />
);

export const NavbarText: FC<ComponentPropsWithRef<'span'>> = ({ className, ...props }) => (
    <span {...props} className={classNames('navbar-text', className)} />
);

export interface NavbarTogglerProps extends Omit<
    ComponentPropsWithRef<'button'>,
    'children' | 'type'
> {
    expanded?: boolean;
}

export const NavbarToggler: FC<NavbarTogglerProps> = ({
    expanded,
    className,
    'aria-label': ariaLabel = 'Toggle navigation',
    ...props
}) => (
    <Button
        {...props}
        type="button"
        className={classNames('navbar-toggler', className)}
        aria-label={ariaLabel}
        aria-expanded={expanded}
        icon
    >
        <span className="navbar-toggler-icon" aria-hidden="true" />
    </Button>
);

Navbar.displayName = 'Navbar';
NavbarBrand.displayName = 'NavbarBrand';
NavbarNav.displayName = 'NavbarNav';
NavbarText.displayName = 'NavbarText';
NavbarToggler.displayName = 'NavbarToggler';
