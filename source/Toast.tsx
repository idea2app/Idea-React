import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FC, ReactNode } from 'react';
import { Toast as BSToast, ToastContainer, ToastContainerProps } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/esm/types';
import { Timestamp } from 'web-utility';

const LIGHT_TEXT_VARIANTS = new Set<Variant>(['warning', 'info', 'light']);

export interface ToastMessage {
    title?: ReactNode;
    body: ReactNode;
    variant?: Variant;
    delay?: number;
}

interface ToastItem extends ToastMessage {
    timestamp: number;
    resolve: () => void;
}

export class Toast {
    @observable
    accessor messages: ToastItem[] = [];

    Component: FC<Pick<ToastContainerProps, 'position'>> = observer(({ position = 'top-end' }) => (
        <ToastContainer position={position} className="position-fixed p-3">
            {this.messages.map(this.renderMessage)}
        </ToastContainer>
    ));

    renderMessage = ({ timestamp, title, body, variant, delay = 3000 }: ToastItem) => {
        const bodyClassName =
            variant && !LIGHT_TEXT_VARIANTS.has(variant) ? 'text-white' : undefined;
        const showHeader = !!title || delay === 0;
        const elapsed = this.TimeScalar.distanceOf<Timestamp>(
            Date.now(),
            timestamp
        ).toShortString();

        return (
            <BSToast
                key={timestamp}
                bg={variant}
                delay={delay}
                autohide={delay !== 0}
                onClose={() => this.close(timestamp)}
            >
                {showHeader && (
                    <BSToast.Header>
                        <strong className="me-auto">{title}</strong>
                        <small>{elapsed}</small>
                    </BSToast.Header>
                )}
                <BSToast.Body className={bodyClassName}>{body}</BSToast.Body>
            </BSToast>
        );
    };

    constructor(public TimeScalar = Timestamp) {
        this.Component.displayName = 'ToastComponent';
    }

    open(message: ToastMessage) {
        const timestamp = Date.now();
        const { promise, resolve } = Promise.withResolvers<void>();

        this.messages = [...this.messages, { ...message, timestamp, resolve }];

        return promise;
    }

    close(timestamp: number) {
        const item = this.messages.find(message => message.timestamp === timestamp);
        item?.resolve();
        this.messages = this.messages.filter(message => message.timestamp !== timestamp);
    }
}
