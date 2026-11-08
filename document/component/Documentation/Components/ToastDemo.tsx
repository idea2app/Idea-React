'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ChangeEvent, Component, ReactNode } from 'react';

import { Button, ComponentTheme } from '../../../../source/Base/Button';
import { CloseButton } from '../../../../source/Base/CloseButton';
import { Image } from '../../../../source/Base/Image';
import {
    Toast,
    ToastBody,
    ToastHeader,
    ToastItem,
    ToastPosition
} from '../../../../source/Base/Toast';
import { FormField, FormLabel, FormSelect } from '../../../../source/Form';

export interface StaticToastProps {
    title?: ReactNode;
    time?: ReactNode;
    body?: ReactNode;
    theme?: ComponentTheme;
    dark?: boolean;
    translucent?: boolean;
    instant?: boolean;
    noHeader?: boolean;
    actions?: boolean;
    live?: 'assertive' | 'polite';
}

@observer
export class StaticToast extends Component<StaticToastProps> {
    @observable accessor visible = true;

    hide = action(() => (this.visible = false));

    renderToast() {
        const { title = 'Bootstrap', time = '11 mins ago', body, actions, dark } = this.props;

        return (
            <>
                <ToastHeader>
                    <Image
                        src="https://github.com/mdo.png"
                        width={20}
                        height={20}
                        className="rounded me-2"
                        alt="Bootstrap"
                    />
                    <strong className="me-auto">{title}</strong>
                    <small className={dark ? 'opacity-60' : undefined}>{time}</small>
                    <CloseButton onClick={this.hide} />
                </ToastHeader>
                <ToastBody>
                    {body}
                    {actions && (
                        <div className="d-flex gap-2 mt-2">
                            <Button variant="solid" theme={dark ? 'primary' : undefined} size="sm">
                                Take action
                            </Button>
                            <Button variant="solid" theme="secondary" size="sm" onClick={this.hide}>
                                Close
                            </Button>
                        </div>
                    )}
                </ToastBody>
            </>
        );
    }

    render() {
        const {
            body,
            theme,
            dark,
            translucent,
            instant,
            noHeader,
            live = 'assertive'
        } = this.props;

        if (!this.visible) return null;

        const toast = (
            <ToastItem
                theme={theme}
                translucent={translucent}
                instant={instant}
                role={live === 'assertive' ? 'alert' : 'status'}
                aria-live={live}
                aria-atomic="true"
            >
                {noHeader ? (
                    <div className="d-flex justify-content-between">
                        <ToastBody>{body}</ToastBody>
                        <CloseButton className="me-3 m-auto" onClick={this.hide} />
                    </div>
                ) : (
                    this.renderToast()
                )}
            </ToastItem>
        );
        return dark ? <div data-bs-theme="dark">{toast}</div> : toast;
    }
}

export interface ToastMessageDemoProps {
    label?: string;
    title?: ReactNode;
    body?: ReactNode;
    delay?: number;
    position?: ToastPosition;
}

@observer
export class ToastMessageDemo extends Component<ToastMessageDemoProps> {
    toast = new Toast();

    handleClick = () => {
        const {
            title = 'Bootstrap',
            body = 'Hello, world! This is a toast message.',
            delay = 5000
        } = this.props;

        this.toast.open({ title, body, delay });
    };

    render() {
        const { label = 'Show live toast', position = 'bottom-end' } = this.props;

        return (
            <>
                <Button variant="solid" theme="primary" onClick={this.handleClick}>
                    {label}
                </Button>
                <this.toast.Component position={position} />
            </>
        );
    }
}

const TOAST_POSITIONS: Record<ToastPosition, string> = {
    'top-start': 'Top left',
    'top-center': 'Top center',
    'top-end': 'Top right',
    'middle-start': 'Middle left',
    'middle-center': 'Middle center',
    'middle-end': 'Middle right',
    'bottom-start': 'Bottom left',
    'bottom-center': 'Bottom center',
    'bottom-end': 'Bottom right'
};

@observer
export class ToastPlacementDemo extends Component {
    toast = new Toast();

    @observable accessor position: ToastPosition = 'top-end';

    handlePositionChange = action(
        ({ target }: ChangeEvent<HTMLSelectElement>) =>
            (this.position = target.value as ToastPosition)
    );

    handleShow = () =>
        this.toast.open({
            title: 'Bootstrap',
            body: 'Hello, world! This is a toast message.',
            delay: 3000
        });

    render() {
        const { position } = this;

        return (
            <>
                <FormField className="mb-3">
                    <FormLabel htmlFor="toastPlacement">Toast placement</FormLabel>
                    <FormSelect
                        id="toastPlacement"
                        className="mt-2"
                        value={position}
                        onChange={this.handlePositionChange}
                    >
                        {Object.entries(TOAST_POSITIONS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </FormSelect>
                </FormField>
                <Button variant="solid" theme="secondary" onClick={this.handleShow}>
                    Show toast
                </Button>
                <this.toast.Component position={position} />
            </>
        );
    }
}
