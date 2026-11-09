'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';

import { Drawer, DrawerPlacement } from '../../../source/Base/Drawer';
import { Navbar, NavbarBrand, NavbarProps, NavbarToggler } from '../../../source/Base/Navbar';
import { Container } from '../../../source/Layout/Grid';

export interface NavbarDemoProps {
    brand?: ReactNode;
    title?: string;
    expand?: NavbarProps['expand'];
    theme?: 'light' | 'dark';
    placement?: DrawerPlacement;
    className?: string;
    bodyClassName?: string;
    togglerFirst?: boolean;
    id?: string;
    'aria-label'?: string;
    children?: ReactNode;
}

@observer
export class NavbarDemo extends Component<NavbarDemoProps> {
    @observable accessor open = false;

    show = action(() => (this.open = true));

    hide = action(() => (this.open = false));

    render() {
        const {
            brand = 'Navbar',
            title = 'Menu',
            expand = 'md',
            theme,
            placement = 'end',
            className = 'bg-1 fg-2',
            bodyClassName,
            togglerFirst,
            id,
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
                open={open}
                title={title}
                placement={placement}
                bodyClassName={bodyClassName}
                responsive={typeof expand === 'string' ? expand : undefined}
                onDismiss={this.hide}
            >
                {children}
            </Drawer>
        );

        return (
            <Navbar
                id={id}
                aria-label={ariaLabel}
                expand={expand}
                theme={theme}
                className={className}
            >
                <Container fluid>
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
                    <div className="container-fluid">
                        <NavbarToggler expanded={open} onClick={this.show} />
                    </div>
                </Navbar>
            </>
        );
    }
}
