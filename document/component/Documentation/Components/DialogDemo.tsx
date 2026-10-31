'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';

import { Button } from '../../../../source/Button';
import { CloseButton } from '../../../../source/CloseButton';
import { Menu, MenuItem } from '../../../../source/Menu';
import { NativeDialog } from '../../../../source/NativeDialog';
import { OverlayBox } from '../../../../source/OverlayBox';
import { Toast } from '../../../../source/Toast';

export interface DialogDemoProps {
    label: ReactNode;
    title: ReactNode;
    children?: ReactNode;
    className?: string;
    backdrop?: boolean | 'static';
    keyboard?: boolean;
    modal?: boolean;
    dark?: boolean;
    saveLabel?: ReactNode;
    hideFooter?: boolean;
}

@observer
export class DialogDemo extends Component<DialogDemoProps> {
    @observable accessor open = false;

    @action
    show = () => {
        this.open = true;
    };

    @action
    hide = () => {
        this.open = false;
    };

    render() {
        const {
            label,
            title,
            children,
            className,
            backdrop,
            keyboard,
            modal,
            dark,
            saveLabel,
            hideFooter
        } = this.props;
        const { open } = this;

        return (
            <>
                <Button variant="solid" theme="primary" onClick={this.show}>
                    {label}
                </Button>
                <NativeDialog
                    open={open}
                    aria-label={typeof title === 'string' ? title : undefined}
                    className={className}
                    backdrop={backdrop}
                    keyboard={keyboard}
                    modal={modal}
                    theme={dark ? 'dark' : undefined}
                    onClose={this.hide}
                >
                    <div className="dialog-header">
                        <h1 className="dialog-title">{title}</h1>
                        <CloseButton onClick={this.hide} />
                    </div>
                    <div className="dialog-body">{children}</div>
                    {!hideFooter && (
                        <div className="dialog-footer">
                            <Button variant="solid" theme="secondary" onClick={this.hide}>
                                Close
                            </Button>
                            {saveLabel && (
                                <Button variant="solid" theme="primary">
                                    {saveLabel}
                                </Button>
                            )}
                        </div>
                    )}
                </NativeDialog>
            </>
        );
    }
}

@observer
export class DialogSwapDemo extends Component {
    @observable accessor current: 'first' | 'second' | undefined;

    @action
    show = (current: 'first' | 'second') => {
        this.current = current;
    };

    @action
    hide = () => {
        this.current = undefined;
    };

    openFirst = () => this.show('first');

    openSecond = () => this.show('second');

    render() {
        const { current } = this;

        return (
            <>
                <Button variant="solid" theme="primary" onClick={this.openFirst}>
                    Open first dialog
                </Button>
                <NativeDialog
                    open={current === 'first'}
                    aria-label="First dialog"
                    onClose={this.hide}
                >
                    <div className="dialog-header">
                        <h1 className="dialog-title">First dialog</h1>
                        <CloseButton onClick={this.hide} />
                    </div>
                    <div className="dialog-body">
                        <p>
                            Click below to swap to a second dialog. The React state change opens the
                            next dialog while the current one closes.
                        </p>
                    </div>
                    <div className="dialog-footer">
                        <Button variant="solid" theme="secondary" onClick={this.hide}>
                            Close
                        </Button>
                        <Button variant="solid" theme="primary" onClick={this.openSecond}>
                            Go to second dialog
                        </Button>
                    </div>
                </NativeDialog>
                <NativeDialog
                    open={current === 'second'}
                    aria-label="Second dialog"
                    onClose={this.hide}
                >
                    <div className="dialog-header">
                        <h1 className="dialog-title">Second dialog</h1>
                        <CloseButton onClick={this.hide} />
                    </div>
                    <div className="dialog-body">
                        <p>
                            This is the second dialog. You can swap back to the first, or close this
                            one entirely.
                        </p>
                    </div>
                    <div className="dialog-footer">
                        <Button variant="solid" theme="secondary" onClick={this.hide}>
                            Close
                        </Button>
                        <Button variant="solid" theme="primary" onClick={this.openFirst}>
                            Back to first dialog
                        </Button>
                    </div>
                </NativeDialog>
            </>
        );
    }
}

@observer
export class DialogOverlaysDemo extends Component {
    @observable accessor open = false;

    toast = new Toast();

    @action
    show = () => {
        this.open = true;
    };

    @action
    hide = () => {
        this.open = false;
    };

    handleShowToast = () => {
        this.toast.open({ body: 'Toast inside a dialog!', delay: 0 });
    };

    render() {
        const { open } = this;

        return (
            <>
                <Button variant="solid" theme="primary" onClick={this.show}>
                    Open dialog
                </Button>
                <NativeDialog
                    open={open}
                    aria-label="Overlays inside dialogs"
                    className="not-prose"
                    onClose={this.hide}
                >
                    <div className="dialog-header">
                        <h1 className="dialog-title">Overlays inside dialogs</h1>
                        <CloseButton onClick={this.hide} />
                    </div>
                    <div className="dialog-body">
                        <p>These components work inside modal dialogs.</p>
                        <div className="d-flex gap-2 flex-wrap">
                            <OverlayBox title="Tooltip inside a dialog!" placement="bottom">
                                <Button variant="solid" theme="secondary">
                                    Tooltip
                                </Button>
                            </OverlayBox>
                            <OverlayBox
                                trigger="click"
                                placement="bottom"
                                title="Popover title"
                                detail="This popover is inside a dialog and renders in the top layer. We include some longer content here to demonstrate the placement and wrapping behavior."
                            >
                                <Button variant="solid" theme="secondary">
                                    Popover
                                </Button>
                            </OverlayBox>
                            <Button
                                variant="solid"
                                theme="secondary"
                                onClick={this.handleShowToast}
                            >
                                Show toast
                            </Button>
                            <Menu
                                label="Menu"
                                toggleProps={{ variant: 'solid', theme: 'secondary' }}
                            >
                                <MenuItem href="#">Action</MenuItem>
                                <MenuItem href="#">Another action</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className="dialog-footer">
                        <Button variant="solid" theme="secondary" onClick={this.hide}>
                            Close
                        </Button>
                    </div>
                    <this.toast.Component position="bottom-end" />
                </NativeDialog>
            </>
        );
    }
}
