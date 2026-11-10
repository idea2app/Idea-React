import './style.less';

import { Button } from '../../../../source/Base/Button';
import { Menu, MenuDivider, MenuItem } from '../../../../source/Base/Menu';
import { NavItem, NavLink } from '../../../../source/Base/Nav';
import { NavbarNav } from '../../../../source/Base/Navbar';
import { FormControl } from '../../../../source/Form';
import { Col, Container } from '../../../../source/Layout/Grid';
import { BaseLayout } from '../../../component/Document/BaseLayout';
import { NavbarDemo } from '../../../component/Document/NavbarDemo';

const drawerNavbarExamples = [
    { brand: 'Dark drawer navbar', theme: 'dark', expand: false, ariaLabel: 'Dark drawer navbar' },
    {
        brand: 'Light drawer navbar',
        theme: 'light',
        expand: false,
        ariaLabel: 'Light drawer navbar'
    },
    {
        brand: 'Responsive drawer navbar',
        theme: 'dark',
        expand: 'lg',
        ariaLabel: 'Drawer navbar large'
    }
] as const;

const drawerNavItems = [
    { label: 'Home', active: true },
    { label: 'Link' },
    { label: 'Menu', menu: true }
];
const drawerMenuItems = ['Action', 'Another action', 'Something else here'] as const;

export default function NavbarsDrawerPage() {
    return (
        <BaseLayout title="Navbar Template">
            <div>
                {drawerNavbarExamples.map(({ brand, theme, expand, ariaLabel }) => (
                    <NavbarDemo
                        key={brand}
                        brand={brand}
                        title="Drawer"
                        expand={expand}
                        theme={theme}
                        aria-label={ariaLabel}
                    >
                        <NavbarNav
                            className={
                                expand ? 'lg:justify-content-end lg:flex-grow-1 pe-3' : 'pe-3'
                            }
                        >
                            {drawerNavItems.map(({ label, active, menu }) => (
                                <NavItem key={label}>
                                    {menu ? (
                                        <Menu nav label={label}>
                                            {drawerMenuItems.slice(0, 2).map(item => (
                                                <MenuItem key={item} href="#">
                                                    {item}
                                                </MenuItem>
                                            ))}
                                            <MenuDivider />
                                            {drawerMenuItems.slice(2).map(item => (
                                                <MenuItem key={item} href="#">
                                                    {item}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    ) : (
                                        <NavLink
                                            href="#"
                                            active={active}
                                            aria-current={active ? 'page' : undefined}
                                        >
                                            {label}
                                        </NavLink>
                                    )}
                                </NavItem>
                            ))}
                        </NavbarNav>
                        <form
                            className={expand ? 'd-flex mt-3 lg:mt-0' : 'd-flex mt-3'}
                            role="search"
                        >
                            <FormControl
                                className="me-2"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                            <Button variant="outline" theme="success" type="submit">
                                Search
                            </Button>
                        </form>
                    </NavbarDemo>
                ))}

                <Container className="my-5">
                    <div className="p-5 rounded">
                        <Col sm={8} className="py-5 mx-auto">
                            <h1 className="fs-4xl fw-normal">Navbar with drawer examples</h1>
                            <p className="fs-lg">
                                This example shows how responsive drawer menus work within the
                                navbar. For positioning of navbars, checkout the{' '}
                                <a href="https://getbootstrap.com/docs/6.0/examples/navbar-static/">
                                    top
                                </a>{' '}
                                and{' '}
                                <a href="https://getbootstrap.com/docs/6.0/examples/navbar-fixed/">
                                    fixed top
                                </a>{' '}
                                examples.
                            </p>
                            <p>
                                From the top down, you'll see a dark navbar, light navbar and a
                                responsive navbar—each with drawers built in. Resize your browser
                                window to the large breakpoint to see the toggle for the drawer.
                            </p>
                            <p>
                                <Button
                                    variant="solid"
                                    theme="primary"
                                    href="https://getbootstrap.com/docs/6.0/components/navbar#drawer"
                                >
                                    Learn more about drawer navbars &raquo;
                                </Button>
                            </p>
                        </Col>
                    </div>
                </Container>
            </div>
        </BaseLayout>
    );
}
