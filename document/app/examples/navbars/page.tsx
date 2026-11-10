import './style.less';

import { Button } from '../../../../source/Base/Button';
import { Drawer } from '../../../../source/Base/Drawer';
import { Menu, MenuItem } from '../../../../source/Base/Menu';
import { NavItem, NavLink } from '../../../../source/Base/Nav';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler } from '../../../../source/Base/Navbar';
import { FormControl } from '../../../../source/Form';
import { Col, Container } from '../../../../source/Layout/Grid';
import { BaseLayout } from '../../../component/Document/BaseLayout';
import { NavbarExample, NavbarExampleProps } from './Example';

const navbarExamples: NavbarExampleProps[] = [
    {
        id: 'navbarsExample01',
        brand: 'Never expand',
        ariaLabel: 'First navbar example',
        fluid: true,
        className: 'bg-black'
    },
    {
        id: 'navbarsExample02',
        brand: 'Always expand',
        ariaLabel: 'Second navbar example',
        expand: true,
        fluid: true,
        className: 'bg-black',
        short: true
    },
    {
        id: 'navbarsExample03',
        brand: 'Expand at sm',
        ariaLabel: 'Third navbar example',
        expand: 'sm',
        fluid: true,
        className: 'bg-black'
    },
    {
        id: 'navbarsExample04',
        brand: 'Expand at md',
        ariaLabel: 'Fourth navbar example',
        expand: 'md',
        fluid: true,
        className: 'bg-black'
    },
    {
        id: 'navbarsExample05',
        brand: 'Expand at lg',
        ariaLabel: 'Fifth navbar example',
        expand: 'lg',
        fluid: true,
        className: 'bg-black'
    },
    {
        id: 'navbarsExample06',
        brand: 'Expand at xl',
        ariaLabel: 'Sixth navbar example',
        expand: 'xl',
        fluid: true,
        className: 'bg-black'
    },
    {
        id: 'navbarsExample2xl',
        brand: 'Expand at 2xl',
        ariaLabel: 'Seventh navbar example',
        expand: '2xl',
        fluid: true,
        className: 'bg-black'
    },
    {
        id: 'navbarsExample07',
        brand: 'Container',
        ariaLabel: 'Eighth navbar example',
        expand: 'lg',
        fluid: false
    },
    {
        id: 'navbarsExample07XL',
        brand: 'Container XL',
        ariaLabel: 'Ninth navbar example',
        expand: 'lg',
        fluid: 'xl'
    }
];

const navbarItems = [
    { label: 'Home', active: true },
    { label: 'Link' },
    { label: 'Disabled', disabled: true },
    { label: 'Menu', menu: true }
];
const shortNavbarItems = navbarItems.slice(0, 2);
const centeredNavbarItems = [{ label: 'Centered nav only', active: true }, ...navbarItems.slice(1)];
const dropdownItems = ['Action', 'Another action', 'Something else here'] as const;

export default function NavbarsPage() {
    return (
        <BaseLayout title="Navbar Template">
            <div>
                {navbarExamples.map(example => (
                    <NavbarExample key={example.id} theme="dark" {...example} />
                ))}

                <Container fluid="xl" className="mb-4">
                    <p>Matching .xl:container...</p>
                </Container>

                <Navbar theme="dark" expand="lg" aria-label="Tenth navbar example">
                    <Container fluid>
                        <NavbarToggler
                            commandfor="navbarsExample08"
                            command="show-modal"
                            aria-controls="navbarsExample08"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        />

                        <Drawer
                            responsive="lg"
                            title="Navigation"
                            placement="end"
                            id="navbarsExample08"
                            className="md:justify-content-center"
                        >
                            <NavbarNav>
                                {centeredNavbarItems.map(({ label, active, disabled, menu }) => (
                                    <NavItem key={label}>
                                        {menu ? (
                                            <Menu nav label={label}>
                                                {dropdownItems.map(item => (
                                                    <MenuItem key={item} href="#">
                                                        {item}
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        ) : (
                                            <NavLink
                                                active={active}
                                                aria-current={active ? 'page' : undefined}
                                                aria-disabled={disabled || undefined}
                                                disabled={disabled}
                                                href={disabled ? undefined : '#'}
                                            >
                                                {label}
                                            </NavLink>
                                        )}
                                    </NavItem>
                                ))}
                            </NavbarNav>
                        </Drawer>
                    </Container>
                </Navbar>

                <Container>
                    <Navbar
                        expand="lg"
                        className="bg-1 rounded"
                        aria-label="Eleventh navbar example"
                    >
                        <Container fluid>
                            <NavbarBrand href="#">Navbar</NavbarBrand>
                            <NavbarToggler
                                commandfor="navbarsExample09"
                                command="show-modal"
                                aria-controls="navbarsExample09"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            />

                            <Drawer
                                responsive="lg"
                                title="Navigation"
                                placement="end"
                                id="navbarsExample09"
                            >
                                <NavbarNav className="me-auto mb-2 lg:mb-0">
                                    {navbarItems.map(({ label, active, disabled, menu }) => (
                                        <NavItem key={label}>
                                            {menu ? (
                                                <Menu nav label={label}>
                                                    {dropdownItems.map(item => (
                                                        <MenuItem key={item} href="#">
                                                            {item}
                                                        </MenuItem>
                                                    ))}
                                                </Menu>
                                            ) : (
                                                <NavLink
                                                    active={active}
                                                    aria-current={active ? 'page' : undefined}
                                                    aria-disabled={disabled || undefined}
                                                    disabled={disabled}
                                                    href={disabled ? undefined : '#'}
                                                >
                                                    {label}
                                                </NavLink>
                                            )}
                                        </NavItem>
                                    ))}
                                </NavbarNav>
                                <form role="search">
                                    <FormControl
                                        type="search"
                                        placeholder="Search"
                                        aria-label="Search"
                                    />
                                </form>
                            </Drawer>
                        </Container>
                    </Navbar>

                    <Navbar
                        expand="lg"
                        className="bg-1 rounded"
                        aria-label="Twelfth navbar example"
                    >
                        <Container fluid>
                            <NavbarToggler
                                commandfor="navbarsExample10"
                                command="show-modal"
                                aria-controls="navbarsExample10"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            />

                            <Drawer
                                responsive="lg"
                                title="Navigation"
                                placement="end"
                                id="navbarsExample10"
                                className="md:justify-content-center"
                            >
                                <NavbarNav>
                                    {centeredNavbarItems.map(
                                        ({ label, active, disabled, menu }) => (
                                            <NavItem key={label}>
                                                {menu ? (
                                                    <Menu nav label={label}>
                                                        {dropdownItems.map(item => (
                                                            <MenuItem key={item} href="#">
                                                                {item}
                                                            </MenuItem>
                                                        ))}
                                                    </Menu>
                                                ) : (
                                                    <NavLink
                                                        active={active}
                                                        aria-current={active ? 'page' : undefined}
                                                        aria-disabled={disabled || undefined}
                                                        disabled={disabled}
                                                        href={disabled ? undefined : '#'}
                                                    >
                                                        {label}
                                                    </NavLink>
                                                )}
                                            </NavItem>
                                        )
                                    )}
                                </NavbarNav>
                            </Drawer>
                        </Container>
                    </Navbar>

                    <Navbar
                        expand="lg"
                        className="bg-1 rounded"
                        aria-label="Thirteenth navbar example"
                    >
                        <Container fluid>
                            <NavbarToggler
                                commandfor="navbarsExample11"
                                command="show-modal"
                                aria-controls="navbarsExample11"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            />

                            <Drawer
                                responsive="lg"
                                title="Navigation"
                                placement="end"
                                id="navbarsExample11"
                                className="lg:d-flex"
                            >
                                <Col as={NavbarBrand} lg={3} className="me-0" href="#">
                                    Centered nav
                                </Col>
                                <Col as={NavbarNav} lg={6} className="lg:justify-content-center">
                                    {navbarItems.map(({ label, active, disabled, menu }) => (
                                        <NavItem key={label}>
                                            {menu ? (
                                                <Menu nav label={label}>
                                                    {dropdownItems.map(item => (
                                                        <MenuItem key={item} href="#">
                                                            {item}
                                                        </MenuItem>
                                                    ))}
                                                </Menu>
                                            ) : (
                                                <NavLink
                                                    active={active}
                                                    aria-current={active ? 'page' : undefined}
                                                    aria-disabled={disabled || undefined}
                                                    disabled={disabled}
                                                    href={disabled ? undefined : '#'}
                                                >
                                                    {label}
                                                </NavLink>
                                            )}
                                        </NavItem>
                                    ))}
                                </Col>
                                <Col lg={3} className="lg:d-flex lg:justify-content-end">
                                    <Button variant="solid" theme="primary">
                                        Button
                                    </Button>
                                </Col>
                            </Drawer>
                        </Container>
                    </Navbar>

                    <div>
                        <div className="bg-1 p-5 rounded">
                            <Col sm={8} className="mx-auto">
                                <h1>Navbar examples</h1>
                                <p>
                                    This example is a quick exercise to illustrate how the navbar
                                    and its contents work. Some navbars extend the width of the
                                    viewport, others are confined within a <code>.container</code>.
                                    For positioning of navbars, checkout the{' '}
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
                                    At the smallest breakpoint, a drawer is used to hide the links
                                    and show a menu button to toggle the collapsed content.
                                </p>
                                <p>
                                    <Button
                                        variant="solid"
                                        theme="primary"
                                        href="https://getbootstrap.com/docs/6.0/components/navbar"
                                    >
                                        View navbar docs &raquo;
                                    </Button>
                                </p>
                            </Col>
                        </div>
                    </div>
                </Container>
            </div>
        </BaseLayout>
    );
}
