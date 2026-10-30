'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FC, MouseEvent, ReactNode } from 'react';
import { Timestamp, uniqueID } from 'web-utility';

import type { ComponentTheme } from './Button';

const LIGHT_TEXT_THEMES = new Set<ComponentTheme>(['warning', 'info', 'light']);

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

interface ToastItem extends ToastMessage {
    openedAt: number;
    closedAt?: number;
    timer?: ReturnType<typeof setTimeout>;
    resolve?: (value: ToastItem) => void;
}

export class Toast {
    @observable
    accessor messages: ToastItem[] = [];

    Component: FC<{ position?: ToastPosition }> = observer(({ position = 'top-end' }) => (
        <div
            className={`toast-container position-fixed p-3 ${TOAST_POSITION_CLASSES[position]}`}
            aria-live="polite"
            aria-atomic="false"
            onClick={this.handleDismiss}
        >
            {this.messages.map(this.renderMessage)}
        </div>
    ));

    renderMessage = ({ id, openedAt, title, body, theme, delay = 3000 }: ToastItem) => {
        const bodyClassName = theme && !LIGHT_TEXT_THEMES.has(theme) ? 'fg-contrast' : undefined;
        const showHeader = !!title || delay === 0;
        const elapsed = this.TimeScalar.distanceOf<Timestamp>(Date.now(), openedAt).toShortString();

        return (
            <div key={id} className={`toast show${theme ? ` theme-${theme}` : ''}`} role="status">
                {showHeader && (
                    <div className="toast-header">
                        <strong className="me-auto">{title}</strong>
                        <small>{elapsed}</small>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            data-toast-dismiss={id}
                        />
                    </div>
                )}
                <div className={`toast-body ${bodyClassName || ''}`}>{body}</div>
            </div>
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
        const { promise, resolve } = Promise.withResolvers<ToastItem>();

        const item: ToastItem = {
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
        resolve?.({ ...item, closedAt: Date.now() } as ToastItem);

        this.messages = this.messages.filter(message => message.id !== id);
    }
}
