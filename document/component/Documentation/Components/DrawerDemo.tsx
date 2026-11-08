'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';

import { Button } from '../../../../source/Base/Button';
import { Drawer, DrawerProps } from '../../../../source/Base/Drawer';

export interface DrawerDemoProps extends Omit<DrawerProps, 'footer'> {
    label: ReactNode;
    title: string;
    footer?: boolean;
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
