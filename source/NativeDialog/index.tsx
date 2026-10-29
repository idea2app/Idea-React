'use client';

import classNames from 'classnames';
import {
    Component,
    createRef,
    DialogHTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    SyntheticEvent
} from 'react';

import styles from './style.module.css';

export interface NativeDialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open'> {
    modal?: boolean;
    keyboard?: boolean;
    backdrop?: boolean | 'static';
}

export class NativeDialog extends Component<NativeDialogProps> {
    element = createRef<HTMLDialogElement>();
    returnFocus?: HTMLElement;

    get open() {
        return this.element.current?.open ?? false;
    }

    show = () => {
        if (this.open) return;
        const element = this.element.current;
        if (!element) return;
        if (document.activeElement instanceof HTMLElement)
            this.returnFocus = document.activeElement;
        if (this.props.modal === false) element.show();
        else element.showModal();
    };

    close = () => {
        if (!this.open) return;
        this.element.current?.close();
        this.returnFocus?.focus();
    };

    componentWillUnmount() {
        this.close();
    }

    handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
        const { onCancel, keyboard = true } = this.props;
        onCancel?.(event);
        const { defaultPrevented } = event;
        event.preventDefault();
        if (keyboard && !defaultPrevented) this.close();
    };

    handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
        const { onKeyDown, keyboard = true } = this.props;
        onKeyDown?.(event);
        const { key, defaultPrevented } = event;
        if (key !== 'Escape' || !keyboard || defaultPrevented) return;
        event.preventDefault();
        this.close();
    };

    handleClick = (event: MouseEvent<HTMLDialogElement>) => {
        const { onClick, backdrop = true } = this.props;
        onClick?.(event);
        const { defaultPrevented, target, currentTarget, clientX, clientY } = event;
        if (backdrop !== true || defaultPrevented || target !== currentTarget) return;
        const { left, right, top, bottom } = currentTarget.getBoundingClientRect();
        if (clientX < left || clientX > right || clientY < top || clientY > bottom) this.close();
    };

    render() {
        const {
            modal: _modal,
            keyboard: _keyboard,
            backdrop = true,
            className,
            onCancel: _onCancel,
            onClick: _onClick,
            onKeyDown: _onKeyDown,
            ...props
        } = this.props;

        return (
            <dialog
                {...props}
                ref={this.element}
                className={classNames(
                    'dialog',
                    backdrop === false && styles.hiddenBackdrop,
                    className
                )}
                data-backdrop={backdrop === false ? 'false' : undefined}
                onCancel={this.handleCancel}
                onKeyDown={this.handleKeyDown}
                onClick={this.handleClick}
            />
        );
    }
}
