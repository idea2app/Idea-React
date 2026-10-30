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

Nav.displayName = 'Nav';
