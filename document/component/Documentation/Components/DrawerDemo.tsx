'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';

import { Button } from '../../../../source/Button';
import { Drawer, DrawerPlacement } from '../../../../source/Drawer';

export interface DrawerDemoProps {
    label: ReactNode;
    title: string;
    placement?: DrawerPlacement;
    theme?: 'light' | 'dark';
    className?: string;
    bodyClassName?: string;
    footer?: boolean;
    modal?: boolean;
    backdrop?: boolean | 'static';
    keyboard?: boolean;
    children?: ReactNode;
}

@observer
export class DrawerDemo extends Component<DrawerDemoProps> {
    @observable accessor open = false;

    show = action(() => (this.open = true));

    hide = action(() => (this.open = false));

    render() {
        const { label, footer, children } = this.props;
        const footerNode = footer && (
            <>
                <Button variant="solid" theme="secondary" onClick={this.hide}>
                    Close
                </Button>
                <Button variant="solid" theme="primary">
                    Save changes
                </Button>
            </>
        );

        return (
            <>
                <Button variant="solid" theme="primary" onClick={this.show}>
                    {label}
                </Button>
                <Drawer {...this.props} footer={footerNode} open={this.open} onDismiss={this.hide}>
                    {children}
                </Drawer>
            </>
        );
    }
}
