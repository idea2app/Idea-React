'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ComponentPropsWithRef, FC, MouseEvent, ReactNode } from 'react';
import { Timestamp, uniqueID } from 'web-utility';

import type { ComponentTheme } from './Button';
import { CloseButton } from './CloseButton';
import { polymorphic } from './Polymorphic';

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

export interface ToastMessage extends Pick<
    ToastItemProps,
    'theme' | 'translucent' | 'instant' | 'role'
> {
    id?: string;
    title?: ReactNode;
    body: ReactNode;
    delay?: number;
}

interface ToastEntry extends ToastMessage {
    openedAt: number;
    closedAt?: number;
    timer?: ReturnType<typeof setTimeout>;
    resolve?: (value: ToastEntry) => void;
}

export interface ToastContainerProps extends ComponentPropsWithRef<'div'> {
    position?: ToastPosition | 'static';
}

export const ToastContainer = polymorphic<ToastContainerProps>(
    ({
        as: Root = 'div',
        position = 'top-end',
        className,
        'aria-live': ariaLive = 'polite',
        'aria-atomic': ariaAtomic = true,
        ...props
    }) => {
        const isStatic = position === 'static';

        return (
            <Root
                {...props}
                className={classNames(
                    'toast-container',
                    !isStatic && 'position-fixed',
                    !isStatic && 'p-3',
                    isStatic ? 'position-static' : TOAST_POSITION_CLASSES[position],
                    className
                )}
                aria-live={ariaLive}
                aria-atomic={ariaAtomic}
            />
        );
    }
);

export interface ToastItemProps extends ComponentPropsWithRef<'div'> {
    theme?: ComponentTheme;
    show?: boolean;
    translucent?: boolean;
    instant?: boolean;
}

export const ToastItem = polymorphic<ToastItemProps>(
    ({
        as: Root = 'div',
        theme,
        show = true,
        translucent,
        instant,
        role = 'status',
        className,
        ...props
    }) => (
        <Root
            {...props}
            className={classNames(
                'toast',
                { show, 'toast-translucent': translucent, 'toast-instant': instant },
                theme && `theme-${theme}`,
                className
            )}
            role={role}
        />
    )
);

export const ToastHeader = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('toast-header', className)} />
    )
);

export const ToastBody = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('toast-body', className)} />
    )
);

export class Toast {
    @observable
    accessor messages: ToastEntry[] = [];

    Component: FC<{ position?: ToastPosition }> = observer(({ position }) => (
        <ToastContainer position={position} onClick={this.handleDismiss}>
            {this.messages.map(this.renderMessage)}
        </ToastContainer>
    ));

    renderMessage = ({
        id,
        openedAt,
        title,
        body,
        theme,
        translucent,
        instant,
        role,
        delay = 3000
    }: ToastEntry) => {
        const showHeader = !!title || delay === 0;
        const elapsed = this.TimeScalar.distanceOf<Timestamp>(Date.now(), openedAt).toShortString();

        return (
            <ToastItem
                key={id}
                theme={theme}
                translucent={translucent}
                instant={instant}
                role={role}
            >
                {showHeader && (
                    <ToastHeader>
                        <strong className="me-auto">{title}</strong>
                        <small>{elapsed}</small>
                        <CloseButton data-toast-dismiss={id} />
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
        const id = message.id ?? uniqueID();
        this.close(id);

        const openedAt = Date.now();
        const { promise, resolve } = Promise.withResolvers<ToastEntry>();
        const timer =
            message.delay === 0
                ? undefined
                : setTimeout(() => this.close(id), message.delay ?? 3000);

        const item: ToastEntry = { ...message, id, openedAt, resolve, timer };

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

ToastContainer.displayName = 'ToastContainer';

ToastItem.displayName = 'ToastItem';

ToastHeader.displayName = 'ToastHeader';

ToastBody.displayName = 'ToastBody';
