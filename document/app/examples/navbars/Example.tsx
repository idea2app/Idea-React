import { FC } from 'react';

import { Menu, MenuItem } from '../../../../source/Base/Menu';
import { NavItem, NavLink } from '../../../../source/Base/Nav';
import { NavbarNav, NavbarProps } from '../../../../source/Base/Navbar';
import { FormControl } from '../../../../source/Form';
import { ContainerProps } from '../../../../source/Layout/Grid';
import { NavbarDemo } from '../../../component/Document/NavbarDemo';

interface NavbarContentsProps extends Pick<NavbarProps, 'expand'> {
    short?: boolean;
}

const NavbarContents: FC<NavbarContentsProps> = ({ expand, short }) => {
    const items = short ? ['Home', 'Link'] : ['Home', 'Link', 'Disabled', 'Menu'];
    const className =
        expand === true
            ? 'me-auto'
            : `me-auto mb-2${typeof expand === 'string' ? ` ${expand}:mb-0` : ''}`;

    return (
        <>
            <NavbarNav className={className}>
                {items.map((label, index) => (
                    <NavItem key={label}>
                        {label === 'Menu' ? (
                            <Menu nav label={label}>
                                {['Action', 'Another action', 'Something else here'].map(item => (
                                    <MenuItem key={item} href="#">
                                        {item}
                                    </MenuItem>
                                ))}
                            </Menu>
                        ) : (
                            <NavLink
                                href={label === 'Disabled' ? undefined : '#'}
                                active={index === 0}
                                aria-current={index === 0 ? 'page' : undefined}
                                disabled={label === 'Disabled'}
                                aria-disabled={label === 'Disabled' || undefined}
                            >
                                {label}
                            </NavLink>
                        )}
                    </NavItem>
                ))}
            </NavbarNav>
            <form role="search">
                <FormControl type="search" placeholder="Search" aria-label="Search" />
            </form>
        </>
    );
};
NavbarContents.displayName = 'NavbarContents';

export interface NavbarExampleProps
    extends NavbarContentsProps, Pick<NavbarProps, 'theme' | 'className'> {
    id: string;
    brand: string;
    ariaLabel: string;
    fluid?: ContainerProps['fluid'];
}

export const NavbarExample: FC<NavbarExampleProps> = ({
    className = '',
    ariaLabel,
    expand = false,
    short,
    ...props
}) => (
    <NavbarDemo
        {...props}
        title="Navigation"
        expand={expand}
        className={className}
        aria-label={ariaLabel}
    >
        <NavbarContents expand={expand} short={short} />
    </NavbarDemo>
);
NavbarExample.displayName = 'NavbarExample';
