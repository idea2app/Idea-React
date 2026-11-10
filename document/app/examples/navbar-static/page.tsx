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

export default function NavbarStaticPage() {
    return (
        <BaseLayout title="Top navbar example">
            <NavbarDemo
                brand="Top navbar"
                title="Menu"
                expand="md"
                theme="dark"
                className="bg-black bg-90 mb-4"
            >
                <NavbarNav className="me-auto mb-2 md:mb-0">
                    {navbarItems.map(({ label, active, disabled }) => (
                        <NavItem key={label}>
                            <NavLink
                                active={active}
                                aria-current={active ? 'page' : undefined}
                                disabled={disabled}
                                aria-disabled={disabled}
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
                    <Button variant="outline" theme="success" type="submit">
                        Search
                    </Button>
                </form>
            </NavbarDemo>

            <Container>
                <div className="bg-1 p-5 rounded">
                    <h1>Navbar example</h1>
                    <p className="fs-lg fw-light">
                        This example is a quick exercise to illustrate how the top-aligned navbar
                        works. As you scroll, this navbar remains in its original position and moves
                        with the rest of the page.
                    </p>
                    <Button
                        variant="solid"
                        theme="primary"
                        size="lg"
                        href="https://getbootstrap.com/docs/6.0/components/navbar"
                    >
                        View navbar docs &raquo;
                    </Button>
                </div>
            </Container>
        </BaseLayout>
    );
}
