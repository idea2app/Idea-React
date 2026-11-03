'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, createRef, MouseEvent } from 'react';

import { Alert } from '../../../../../source/Alert';
import { Button } from '../../../../../source/Button';
import { Drawer } from '../../../../../source/Drawer';
import { Menu, MenuItem } from '../../../../../source/Menu';

@observer
export class AlertGuideDemo extends Component {
    @observable accessor visible = false;

    trigger = createRef<HTMLButtonElement>();

    show = action(() => (this.visible = true));

    hide = action(() => {
        this.visible = false;
        this.trigger.current?.focus();
    });

    render() {
        return (
            <div className="d-flex flex-column align-items-start gap-3">
                {this.visible && (
                    <Alert theme="success" dismissible onClosed={this.hide}>
                        Nice, you triggered this alert message!
                    </Alert>
                )}
                <Button ref={this.trigger} variant="solid" theme="primary" onClick={this.show}>
                    Show live alert
                </Button>
            </div>
        );
    }
}

@observer
export class DrawerTriggersGuideDemo extends Component {
    @observable accessor open = false;

    show = action(() => (this.open = true));

    hide = action(() => (this.open = false));

    handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        this.show();
    };

    render() {
        return (
            <div className="d-flex flex-wrap gap-2">
                <Button
                    href="#drawer-example"
                    role="button"
                    variant="solid"
                    theme="primary"
                    aria-controls="drawer-example"
                    onClick={this.handleLinkClick}
                >
                    Link with href
                </Button>
                <Button
                    variant="solid"
                    theme="primary"
                    aria-controls="drawer-example"
                    onClick={this.show}
                >
                    Open drawer
                </Button>
                <Drawer
                    id="drawer-example"
                    title="Drawer"
                    placement="start"
                    open={this.open}
                    onDismiss={this.hide}
                >
                    <p>
                        Some text as placeholder. In real life you can have the elements you have
                        chosen. Like text, images, lists, etc.
                    </p>
                    <Menu label="Menu">
                        <MenuItem href="#examples">Action</MenuItem>
                        <MenuItem href="#examples">Another action</MenuItem>
                        <MenuItem href="#examples">Something else here</MenuItem>
                    </Menu>
                </Drawer>
            </div>
        );
    }
}
