'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';

import { Button } from '../../../../source/Button';
import { CloseButton } from '../../../../source/CloseButton';
import { OverlayBox } from '../../../../source/Extension/OverlayBox';
import { Menu, MenuItem } from '../../../../source/Menu';
import {
    DialogBody,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    NativeDialog,
    NativeDialogProps
} from '../../../../source/NativeDialog';
import { Toast } from '../../../../source/Toast';

export interface DialogDemoProps extends Omit<NativeDialogProps, 'title'> {
    label: ReactNode;
    title: ReactNode;
    dark?: boolean;
    saveLabel?: ReactNode;
    hideFooter?: boolean;
}

@observer
export class DialogDemo extends Component<DialogDemoProps> {
    @observable accessor open = false;

    show = action(() => (this.open = true));

    hide = action(() => (this.open = false));

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
            hideFooter,
            ...props
        } = this.props;
        const { open } = this;

        return (
            <>
                <Button variant="solid" theme="primary" onClick={this.show}>
                    {label}
                </Button>
                <NativeDialog
                    {...props}
                    open={open}
                    aria-label={typeof title === 'string' ? title : undefined}
                    className={className}
                    backdrop={backdrop}
                    keyboard={keyboard}
                    modal={modal}
                    theme={dark ? 'dark' : undefined}
                    onClose={this.hide}
                >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <CloseButton onClick={this.hide} />
                    </DialogHeader>
                    <DialogBody>{children}</DialogBody>
                    {!hideFooter && (
                        <DialogFooter>
                            <Button variant="solid" theme="secondary" onClick={this.hide}>
                                Close
                            </Button>
                            {saveLabel && (
                                <Button variant="solid" theme="primary">
                                    {saveLabel}
                                </Button>
                            )}
                        </DialogFooter>
                    )}
                </NativeDialog>
            </>
        );
    }
}

@observer
export class DialogSwapDemo extends Component {
    @observable accessor current: 'first' | 'second' | undefined;

    show = action((current: 'first' | 'second') => (this.current = current));

    hide = action(() => (this.current = undefined));

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
                    <DialogHeader>
                        <DialogTitle>First dialog</DialogTitle>
                        <CloseButton onClick={this.hide} />
                    </DialogHeader>
                    <DialogBody>
                        <p>
                            Click below to swap to a second dialog. The React state change opens the
                            next dialog while the current one closes.
                        </p>
                    </DialogBody>
                    <DialogFooter>
                        <Button variant="solid" theme="secondary" onClick={this.hide}>
                            Close
                        </Button>
                        <Button variant="solid" theme="primary" onClick={this.openSecond}>
                            Go to second dialog
                        </Button>
                    </DialogFooter>
                </NativeDialog>
                <NativeDialog
                    open={current === 'second'}
                    aria-label="Second dialog"
                    onClose={this.hide}
                >
                    <DialogHeader>
                        <DialogTitle>Second dialog</DialogTitle>
                        <CloseButton onClick={this.hide} />
                    </DialogHeader>
                    <DialogBody>
                        <p>
                            This is the second dialog. You can swap back to the first, or close this
                            one entirely.
                        </p>
                    </DialogBody>
                    <DialogFooter>
                        <Button variant="solid" theme="secondary" onClick={this.hide}>
                            Close
                        </Button>
                        <Button variant="solid" theme="primary" onClick={this.openFirst}>
                            Back to first dialog
                        </Button>
                    </DialogFooter>
                </NativeDialog>
            </>
        );
    }
}

@observer
export class DialogOverlaysDemo extends Component {
    @observable accessor open = false;

    toast = new Toast();

    show = action(() => (this.open = true));

    hide = action(() => (this.open = false));

    handleShowToast = () => this.toast.open({ body: 'Toast inside a dialog!', delay: 0 });

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
                    <DialogHeader>
                        <DialogTitle>Overlays inside dialogs</DialogTitle>
                        <CloseButton onClick={this.hide} />
                    </DialogHeader>
                    <DialogBody>
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
                    </DialogBody>
                    <DialogFooter>
                        <Button variant="solid" theme="secondary" onClick={this.hide}>
                            Close
                        </Button>
                    </DialogFooter>
                    <this.toast.Component position="bottom-end" />
                </NativeDialog>
            </>
        );
    }
}
