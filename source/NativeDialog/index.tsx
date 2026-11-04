'use client';

import classNames from 'classnames';
import {
    Component,
    ComponentPropsWithRef,
    createRef,
    DialogHTMLAttributes,
    ElementType,
    KeyboardEvent,
    MouseEvent,
    SyntheticEvent
} from 'react';

import { Breakpoint } from '../Grid';
import { AsProps, polymorphic, PolymorphicClassProps } from '../Polymorphic';
import styles from './style.module.css';

const transitionMilliseconds = (value: string) =>
    (parseFloat(value) || 0) * (value.trim().endsWith('ms') ? 1 : 1000);

export interface NativeDialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open'> {
    modal?: boolean;
    dialog?: boolean;
    theme?: 'light' | 'dark';
    keyboard?: boolean;
    backdrop?: boolean | 'static';
    open?: boolean;
    size?: 'sm' | 'lg' | 'xl';
    fullscreen?: boolean | Breakpoint;
    scrollable?: boolean;
    animation?: 'fade' | 'instant' | 'slide-down' | 'slide-up';
    scroll?: boolean;
}

export const DialogHeader = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('dialog-header', className)} />
    )
);
DialogHeader.displayName = 'DialogHeader';

export const DialogTitle = polymorphic<ComponentPropsWithRef<'h1'>>(
    ({ as: Root = 'h1', className, ...props }) => (
        <Root {...props} className={classNames('dialog-title', className)} />
    )
);
DialogTitle.displayName = 'DialogTitle';

export const DialogBody = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('dialog-body', className)} />
    )
);
DialogBody.displayName = 'DialogBody';

export const DialogFooter = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('dialog-footer', className)} />
    )
);
DialogFooter.displayName = 'DialogFooter';

export class NativeDialog<T extends ElementType | undefined = 'dialog'> extends Component<
    PolymorphicClassProps<T, NativeDialogProps>
> {
    declare readonly props: PolymorphicClassProps<T, NativeDialogProps>;

    protected get componentProps(): Readonly<NativeDialogProps & AsProps> {
        return this.props;
    }

    static scrollLocks = new Set<NativeDialog<ElementType>>();
    static bodyOverflow = '';

    element = createRef<HTMLDialogElement>();
    returnFocus?: HTMLElement;
    switchingMode = false;
    closeTimer?: ReturnType<typeof setTimeout>;

    get open() {
        return this.element.current?.open ?? false;
    }

    componentDidMount() {
        if (this.componentProps.open) this.show();
    }

    componentDidUpdate({ open, modal, scroll }: NativeDialogProps) {
        const modeChanged = this.componentProps.modal !== modal;
        const openChanged = this.componentProps.open !== open;
        const wasOpen = this.open;
        if (!openChanged && !modeChanged && this.componentProps.scroll === scroll) return;

        if (this.open && this.componentProps.modal !== modal) {
            this.switchingMode = true;
            this.close();
        }
        if (this.componentProps.scroll) this.unlockScroll();
        else if (this.open && this.componentProps.modal !== false) this.lockScroll();

        if (!openChanged && !modeChanged) return;

        if (this.componentProps.open || (!openChanged && modeChanged && wasOpen)) this.show();
        else this.close();
    }

    show = () => {
        clearTimeout(this.closeTimer);
        this.element.current?.classList.remove('hiding');
        if (this.open) return;

        const element = this.element.current;
        if (!element) return;

        if (!this.switchingMode && document.activeElement instanceof HTMLElement)
            this.returnFocus = document.activeElement;
        if (this.componentProps.modal === false) element.show();
        else element.showModal();
        if (this.componentProps.modal !== false && !this.componentProps.scroll) this.lockScroll();
    };

    lockScroll = () => {
        const { scrollLocks } = NativeDialog;

        if (!scrollLocks.size) {
            NativeDialog.bodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        }
        scrollLocks.add(this);
    };

    unlockScroll = () => {
        const { scrollLocks } = NativeDialog;

        if (!scrollLocks.delete(this)) return;
        if (!scrollLocks.size) document.body.style.overflow = NativeDialog.bodyOverflow;
    };

    close = () => {
        const element = this.element.current;
        if (!this.open || !element || this.switchingMode) return this.finishClose();

        const { transitionDuration, transitionDelay } = getComputedStyle(element);
        const durations = transitionDuration.split(',').map(transitionMilliseconds);
        const delays = transitionDelay.split(',').map(transitionMilliseconds);
        const duration = Math.max(
            0,
            ...durations.map((value, index) => value + delays[index % delays.length])
        );
        if (!duration) return this.finishClose();
        if (element.classList.contains('hiding')) return;

        element.classList.add('hiding');
        this.closeTimer = setTimeout(this.finishClose, duration);
    };

    finishClose = () => {
        clearTimeout(this.closeTimer);
        this.element.current?.classList.remove('hiding');
        this.unlockScroll();

        if (!this.open) return;

        this.element.current?.close();
        this.returnFocus?.focus();
    };

    handleClose = (event: SyntheticEvent<HTMLDialogElement>) => {
        if (!this.switchingMode) this.componentProps.onClose?.(event);

        if (!this.open) {
            this.unlockScroll();
            this.returnFocus?.focus();
        }
        this.switchingMode = false;
    };

    componentWillUnmount() {
        this.finishClose();
    }

    handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
        const { onCancel, keyboard = true } = this.componentProps;
        onCancel?.(event);

        const { defaultPrevented } = event;
        event.preventDefault();

        if (keyboard && !defaultPrevented) this.close();
    };

    handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
        const { onKeyDown, keyboard = true } = this.componentProps;
        onKeyDown?.(event);

        const { key, defaultPrevented } = event;
        if (key !== 'Escape' || !keyboard || defaultPrevented) return;

        event.preventDefault();
        this.close();
    };

    handleClick = (event: MouseEvent<HTMLDialogElement>) => {
        const { onClick, backdrop = true } = this.componentProps;
        onClick?.(event);

        const { defaultPrevented, target, currentTarget, clientX, clientY } = event;
        if (backdrop !== true || defaultPrevented || target !== currentTarget) return;

        const { left, right, top, bottom } = currentTarget.getBoundingClientRect();
        if (clientX < left || clientX > right || clientY < top || clientY > bottom) this.close();
    };

    render() {
        const Root: ElementType = this.componentProps.as ?? 'dialog';

        const {
            as: _as,
            open: _open,
            modal: _modal,
            keyboard: _keyboard,
            backdrop = true,
            theme,
            dialog = true,
            size,
            fullscreen,
            scrollable,
            animation = 'fade',
            scroll: _scroll,
            className,
            onCancel: _onCancel,
            onClick: _onClick,
            onKeyDown: _onKeyDown,
            onClose: _onClose,
            ...props
        } = this.componentProps;

        return (
            <Root
                {...props}
                ref={this.element}
                className={classNames(
                    dialog && 'dialog',
                    dialog && size && `dialog-${size}`,
                    dialog &&
                        fullscreen &&
                        (fullscreen === true
                            ? 'dialog-fullscreen'
                            : `${fullscreen}-down:dialog-fullscreen`),
                    dialog && scrollable && 'dialog-scrollable',
                    dialog && animation !== 'fade' && `dialog-${animation}`,
                    backdrop === false && styles.hiddenBackdrop,
                    className
                )}
                data-backdrop={backdrop === false ? 'false' : undefined}
                data-bs-theme={theme}
                onCancel={this.handleCancel}
                onKeyDown={this.handleKeyDown}
                onClick={this.handleClick}
                onClose={this.handleClose}
            />
        );
    }
}
