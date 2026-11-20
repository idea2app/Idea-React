'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, createRef, PropsWithChildren, ReactNode } from 'react';

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
    @observable accessor expanded = false;

    navbar = createRef<HTMLElement>();
    toggler = createRef<HTMLButtonElement>();
    resizeObserver?: ResizeObserver;

    componentDidMount() {
        this.resizeObserver = new ResizeObserver(this.syncExpansion);
        if (this.navbar.current) this.resizeObserver.observe(this.navbar.current);

        this.syncExpansion();
    }

    componentDidUpdate({ expand }: NavbarDemoProps) {
        if (expand !== this.props.expand) this.syncExpansion();
    }

    componentWillUnmount() {
        this.resizeObserver?.disconnect();
    }

    syncExpansion = action(() => {
        const toggler = this.toggler.current;
        const expanded = !!toggler && getComputedStyle(toggler).display === 'none';

        if (expanded) this.open = false;

        this.expanded = expanded;
    });

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
        const { open, expanded } = this;
        const alwaysExpanded = expand === true;
        const brandNode = brand != null && <NavbarBrand href="#">{brand}</NavbarBrand>;
        const toggler = !alwaysExpanded && (
            <NavbarToggler ref={this.toggler} expanded={open} onClick={this.show} />
        );
        const navigation = alwaysExpanded ? (
            children
        ) : (
            <Drawer
                {...{ title, placement, bodyClassName }}
                open={expanded || open}
                modal={!expanded}
                onDismiss={this.hide}
            >
                {children}
            </Drawer>
        );

        return (
            <Navbar ref={this.navbar} {...{ id, className, expand, theme }} aria-label={ariaLabel}>
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
