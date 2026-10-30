'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ComponentPropsWithRef, FC, MouseEvent, ReactNode } from 'react';
import { Timestamp, uniqueID } from 'web-utility';

import type { ComponentTheme } from './Button';

export type ToastPosition =
    | 'top-start'
    | 'top-center'
    | 'top-end'
    | 'middle-start'
    | 'middle-center'
    | 'middle-end'
    | 'bottom-start'
    | 'bottom-center'
    | 'bottom-end';

const TOAST_POSITION_CLASSES: Record<ToastPosition, string> = {
    'top-start': 'top-0 start-0',
    'top-center': 'top-0 start-50 translate-middle-x',
    'top-end': 'top-0 end-0',
    'middle-start': 'top-50 start-0 translate-middle-y',
    'middle-center': 'top-50 start-50 translate-middle',
    'middle-end': 'top-50 end-0 translate-middle-y',
    'bottom-start': 'bottom-0 start-0',
    'bottom-center': 'bottom-0 start-50 translate-middle-x',
    'bottom-end': 'bottom-0 end-0'
};

export interface ToastMessage {
    id?: string;
    title?: ReactNode;
    body: ReactNode;
    theme?: ComponentTheme;
    delay?: number;
}

interface ToastEntry extends ToastMessage {
    openedAt: number;
    closedAt?: number;
    timer?: ReturnType<typeof setTimeout>;
    resolve?: (value: ToastEntry) => void;
}

export interface ToastContainerProps extends ComponentPropsWithRef<'div'> {
    position?: ToastPosition;
}

export const ToastContainer: FC<ToastContainerProps> = ({
    position = 'top-end',
    className,
    'aria-live': ariaLive = 'polite',
    'aria-atomic': ariaAtomic = false,
    ...props
}) => (
    <div
        {...props}
        className={classNames(
            'toast-container position-fixed p-3',
            TOAST_POSITION_CLASSES[position],
            className
        )}
        aria-live={ariaLive}
        aria-atomic={ariaAtomic}
    />
);

export interface ToastItemProps extends ComponentPropsWithRef<'div'> {
    theme?: ComponentTheme;
}

export const ToastItem: FC<ToastItemProps> = ({ theme, role = 'status', className, ...props }) => (
    <div
        {...props}
        className={classNames('toast show', theme && `theme-${theme}`, className)}
        role={role}
    />
);

export const ToastHeader: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('toast-header', className)} />
);

export const ToastBody: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('toast-body', className)} />
);

export class Toast {
    @observable
    accessor messages: ToastEntry[] = [];

    Component: FC<{ position?: ToastPosition }> = observer(({ position }) => (
        <ToastContainer position={position} onClick={this.handleDismiss}>
            {this.messages.map(this.renderMessage)}
        </ToastContainer>
    ));

    renderMessage = ({ id, openedAt, title, body, theme, delay = 3000 }: ToastEntry) => {
        const showHeader = !!title || delay === 0;
        const elapsed = this.TimeScalar.distanceOf<Timestamp>(Date.now(), openedAt).toShortString();

        return (
            <ToastItem key={id} theme={theme}>
                {showHeader && (
                    <ToastHeader>
                        <strong className="me-auto">{title}</strong>
                        <small>{elapsed}</small>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            data-toast-dismiss={id}
                        />
                    </ToastHeader>
                )}
                <ToastBody>{body}</ToastBody>
            </ToastItem>
        );
    };

    handleDismiss = ({ target }: MouseEvent<HTMLDivElement>) => {
        if (!(target instanceof Element)) return;

        const id = target.closest<HTMLElement>('[data-toast-dismiss]')?.dataset.toastDismiss;
        if (id) this.close(id);
    };

    constructor(public TimeScalar = Timestamp) {
        this.Component.displayName = 'ToastComponent';
    }

    @action
    open(message: ToastMessage) {
        const id = uniqueID();
        const openedAt = Date.now();
        const { promise, resolve } = Promise.withResolvers<ToastEntry>();

        const item: ToastEntry = {
            id,
            ...message,
            openedAt,
            resolve,
            timer:
                message.delay === 0
                    ? undefined
                    : setTimeout(() => this.close(id), message.delay ?? 3000)
        };
        this.messages = [...this.messages, item];

        return promise;
    }

    @action
    close(id: string) {
        const message = this.messages.find(message => message.id === id);
        if (!message) return;

        const { resolve, timer, ...item } = message;

        clearTimeout(timer);
        resolve?.({ ...item, closedAt: Date.now() } as ToastEntry);

        this.messages = this.messages.filter(message => message.id !== id);
    }
}
