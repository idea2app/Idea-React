import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export interface NavbarProps extends ComponentPropsWithRef<'nav'> {
    expand?: boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Navbar: FC<NavbarProps> = ({ expand, className, ...props }) => (
    <nav
        {...props}
        className={classNames(
            'navbar',
            expand && (expand === true ? 'navbar-expand' : `${expand}:navbar-expand`),
            className
        )}
    />
);
