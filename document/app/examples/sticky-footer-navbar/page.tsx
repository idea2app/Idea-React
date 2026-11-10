import './style.less';

import { Button } from '../../../../source/Base/Button';
import { NavItem, NavLink } from '../../../../source/Base/Nav';
import { NavbarNav } from '../../../../source/Base/Navbar';
import { FormControl } from '../../../../source/Form';
import { Container } from '../../../../source/Layout/Grid';
import { BaseLayout } from '../../../component/Document/BaseLayout';
import { NavbarDemo } from '../../../component/Document/NavbarDemo';

const navbarItems = [
    { label: 'Home', active: true },
    { label: 'Link' },
    { label: 'Disabled', disabled: true }
];

export default function StickyFooterNavbarPage() {
    return (
        <BaseLayout
            title="Sticky Footer Navbar Template"
            className="d-flex flex-column h-100 min-vh-100"
        >
            <header>
                {/* Fixed navbar */}
                <NavbarDemo
                    brand="Fixed navbar"
                    title="Menu"
                    expand="md"
                    theme="dark"
                    className="fixed-top"
                >
                    <NavbarNav className="me-auto mb-2 md:mb-0">
                        {navbarItems.map(({ label, active, disabled }) => (
                            <NavItem key={label}>
                                <NavLink
                                    active={active}
                                    aria-current={active ? 'page' : undefined}
                                    aria-disabled={disabled || undefined}
                                    disabled={disabled}
                                    href={disabled ? undefined : '#'}
                                >
                                    {label}
                                </NavLink>
                            </NavItem>
                        ))}
                    </NavbarNav>
                    <form className="d-flex" role="search">
                        <FormControl
                            className="me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                        />
                        <Button variant="solid" theme="success" type="submit">
                            Search
                        </Button>
                    </form>
                </NavbarDemo>
            </header>

            {/* Begin page content */}

            <div className="flex-shrink-0">
                <Container>
                    <h1 className="mt-5">Sticky footer with fixed navbar</h1>
                    <p className="fs-lg fw-light">
                        Pin a footer to the bottom of the viewport in desktop browsers with this
                        custom HTML and CSS. A fixed navbar has been added with{' '}
                        <code className="small">padding-top: 60px;</code> on the{' '}
                        <code className="small">main &gt; .container</code>.
                    </p>
                    <p>
                        Back to{' '}
                        <a href="https://getbootstrap.com/docs/6.0/examples/sticky-footer/">
                            the default sticky footer
                        </a>{' '}
                        minus the navbar.
                    </p>
                </Container>
            </div>

            <footer className="footer mt-auto py-3 bg-1">
                <Container>
                    <span className="fg-2">Place sticky footer content here.</span>
                </Container>
            </footer>
        </BaseLayout>
    );
}
