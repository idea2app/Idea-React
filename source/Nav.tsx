import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export interface NavProps extends ComponentPropsWithRef<'nav'> {
    variant?: 'tabs' | 'pills' | 'underline';
    vertical?: boolean;
    fill?: boolean;
    justified?: boolean;
}

export const Nav: FC<NavProps> = ({ variant, vertical, fill, justified, className, ...props }) => (
    <nav
        {...props}
        className={classNames(
            'nav',
            variant && `nav-${variant}`,
            vertical && (variant === 'pills' ? 'nav-pills-vertical' : 'flex-column'),
            { 'nav-fill': fill, 'nav-justified': justified },
            className
        )}
    />
);

export const NavItem: FC<ComponentPropsWithRef<'li'>> = ({ className, ...props }) => (
    <li {...props} className={classNames('nav-item', className)} />
);

export interface NavLinkProps extends ComponentPropsWithRef<'a'> {
    disabled?: boolean;
}

export const NavLink: FC<NavLinkProps> = ({
    disabled,
    className,
    href,
    onClick,
    tabIndex,
    ...props
}) => (
    <a
        {...props}
        href={disabled ? undefined : href}
        tabIndex={disabled ? -1 : tabIndex}
        aria-disabled={disabled || undefined}
        className={classNames('nav-link', { disabled, 'pe-none': disabled }, className)}
        onClick={disabled ? undefined : onClick}
    />
);

Nav.displayName = 'Nav';
NavItem.displayName = 'NavItem';
NavLink.displayName = 'NavLink';
