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

    @action
    show = () => (this.open = true);

    @action
    hide = () => (this.open = false);

    render() {
        const {
            label,
            title,
            placement,
            theme,
            className,
            bodyClassName,
            footer,
            modal,
            backdrop,
            keyboard,
            children
        } = this.props;
        const { open } = this;

        return (
            <>
                <Button variant="solid" theme="primary" onClick={this.show}>
                    {label}
                </Button>
                <Drawer
                    open={open}
                    title={title}
                    placement={placement}
                    theme={theme}
                    className={className}
                    bodyClassName={bodyClassName}
                    modal={modal}
                    backdrop={backdrop}
                    keyboard={keyboard}
                    footer={
                        footer && (
                            <>
                                <Button variant="solid" theme="secondary" onClick={this.hide}>
                                    Close
                                </Button>
                                <Button variant="solid" theme="primary">
                                    Save changes
                                </Button>
                            </>
                        )
                    }
                    onDismiss={this.hide}
                >
                    {children}
                </Drawer>
            </>
        );
    }
}
