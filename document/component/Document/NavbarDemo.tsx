'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, PropsWithChildren, ReactNode } from 'react';

import { Drawer, DrawerPlacement } from '../../../source/Base/Drawer';
import { Navbar, NavbarBrand, NavbarProps, NavbarToggler } from '../../../source/Base/Navbar';
import { Container, ContainerProps } from '../../../source/Layout/Grid';

export type NavbarDemoProps = PropsWithChildren<{
    id?: string;
    className?: string;
    bodyClassName?: string;
    title?: string;
    brand?: ReactNode;
    expand?: NavbarProps['expand'];
    theme?: 'light' | 'dark';
    placement?: DrawerPlacement;
    fluid?: ContainerProps['fluid'];
    togglerFirst?: boolean;
    'aria-label'?: string;
}>;

@observer
export class NavbarDemo extends Component<NavbarDemoProps> {
    @observable accessor open = false;

    show = action(() => (this.open = true));

    hide = action(() => (this.open = false));

    render() {
        const {
            id,
            className = 'bg-1 fg-2',
            bodyClassName,
            brand = 'Navbar',
            title = 'Menu',
            expand = 'md',
            theme,
            placement = 'end',
            fluid = true,
            togglerFirst,
            'aria-label': ariaLabel,
            children
        } = this.props;
        const { open } = this;
        const alwaysExpanded = expand === true;
        const brandNode = brand != null && <NavbarBrand href="#">{brand}</NavbarBrand>;
        const toggler = !alwaysExpanded && <NavbarToggler expanded={open} onClick={this.show} />;
        const navigation = alwaysExpanded ? (
            children
        ) : (
            <Drawer
                {...{ open, title, placement, bodyClassName }}
                responsive={typeof expand === 'string' ? expand : undefined}
                onDismiss={this.hide}
            >
                {children}
            </Drawer>
        );

        return (
            <Navbar {...{ id, className, expand, theme }} aria-label={ariaLabel}>
                <Container fluid={fluid}>
                    {togglerFirst ? toggler : brandNode}
                    {togglerFirst ? brandNode : toggler}
                    {navigation}
                </Container>
            </Navbar>
        );
    }
}

@observer
export class NavbarExternalDemo extends Component {
    @observable accessor open = false;

    show = action(() => (this.open = true));

    hide = action(() => (this.open = false));

    render() {
        const { open } = this;

        return (
            <>
                <Drawer
                    open={open}
                    theme="dark"
                    placement="top"
                    title="Collapsed content"
                    onDismiss={this.hide}
                >
                    <span className="fg-2">Toggled via the navbar toggler.</span>
                </Drawer>
                <Navbar theme="dark" className="bg-body">
                    <Container fluid>
                        <NavbarToggler expanded={open} onClick={this.show} />
                    </Container>
                </Navbar>
            </>
        );
    }
}
