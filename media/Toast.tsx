import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FC, ReactNode } from 'react';
import { Toast as BSToast, ToastContainer, ToastContainerProps } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/esm/types';
import { Timestamp, uniqueID } from 'web-utility';

const LIGHT_TEXT_VARIANTS = new Set<Variant>(['warning', 'info', 'light']);

export interface ToastMessage {
    id?: string;
    title?: ReactNode;
    body: ReactNode;
    variant?: Variant;
    delay?: number;
}

interface ToastItem extends ToastMessage {
    openedAt: number;
    closedAt?: number;
    resolve?: (value: ToastItem) => void;
}

export class Toast {
    @observable
    accessor messages: ToastItem[] = [];

    Component: FC<Pick<ToastContainerProps, 'position'>> = observer(({ position = 'top-end' }) => (
        <ToastContainer position={position} className="position-fixed p-3">
            {this.messages.map(this.renderMessage)}
        </ToastContainer>
    ));

    renderMessage = ({ id, openedAt, title, body, variant, delay = 3000 }: ToastItem) => {
        const bodyClassName =
            variant && !LIGHT_TEXT_VARIANTS.has(variant) ? 'text-white' : undefined;
        const showHeader = !!title || delay === 0;
        const elapsed = this.TimeScalar.distanceOf<Timestamp>(Date.now(), openedAt).toShortString();

        return (
            <BSToast
                key={id}
                bg={variant}
                delay={delay}
                autohide={delay !== 0}
                onClose={() => this.close(id!)}
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
        const id = uniqueID();
        const openedAt = Date.now();
        const { promise, resolve } = Promise.withResolvers<ToastItem>();

        this.messages = [...this.messages, { id, ...message, openedAt, resolve }];

        return promise;
    }

    close(id: string) {
        const { resolve, ...item } = this.messages.find(message => message.id === id) || {};

        resolve?.({ ...item, closedAt: Date.now() } as ToastItem);

        this.messages = this.messages.filter(message => message.id !== id);
    }
}
