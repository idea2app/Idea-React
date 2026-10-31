'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';

import { Drawer, DrawerPlacement } from '../../../../source/Drawer';
import { Navbar, NavbarBrand, NavbarProps, NavbarToggler } from '../../../../source/Navbar';

export interface NavbarDemoProps {
    brand?: ReactNode;
    title?: string;
    expand?: NavbarProps['expand'];
    theme?: 'light' | 'dark';
    placement?: DrawerPlacement;
    className?: string;
    bodyClassName?: string;
    togglerFirst?: boolean;
    children?: ReactNode;
}

@observer
export class NavbarDemo extends Component<NavbarDemoProps> {
    @observable accessor open = false;

    @action
    show = () => (this.open = true);

    @action
    hide = () => (this.open = false);

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
            children
        } = this.props;
        const { open } = this;
        const brandNode = brand != null && <NavbarBrand href="#">{brand}</NavbarBrand>;
        const toggler = <NavbarToggler expanded={open} onClick={this.show} />;

        return (
            <Navbar expand={expand} theme={theme} className={className}>
                <div className="container-fluid">
                    {togglerFirst ? toggler : brandNode}
                    {togglerFirst ? brandNode : toggler}
                    <Drawer
                        open={open}
                        title={title}
                        placement={placement}
                        bodyClassName={bodyClassName}
                        onDismiss={this.hide}
                    >
                        {children}
                    </Drawer>
                </div>
            </Navbar>
        );
    }
}

@observer
export class NavbarExternalDemo extends Component {
    @observable accessor open = false;

    @action
    show = () => (this.open = true);

    @action
    hide = () => (this.open = false);

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
