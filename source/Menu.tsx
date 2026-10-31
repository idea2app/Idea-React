'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    Component,
    createRef,
    FC,
    FocusEvent,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    PropsWithChildren,
    ReactNode
} from 'react';

import { Button, ButtonProps } from './Button';

export const MenuItem: FC<ButtonProps> = ({ className, ...props }) => (
    <Button {...props} className={classNames('menu-item', className)} />
);

export const MenuPanel: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div {...props} className={classNames('menu', className)} />
);

export const MenuText: FC<HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
    <span {...props} className={classNames('menu-text', className)} />
);

export const MenuHeader: FC<HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
    <h6 {...props} className={classNames('menu-header', className)} />
);

export const MenuDivider: FC<HTMLAttributes<HTMLHRElement>> = ({ className, ...props }) => (
    <hr {...props} className={classNames('menu-divider', className)} />
);

export const MenuItemContent: FC<HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
    <span {...props} className={classNames('menu-item-content', className)} />
);

export const MenuItemDescription: FC<HTMLAttributes<HTMLElement>> = ({ className, ...props }) => (
    <small {...props} className={classNames('menu-item-description', className)} />
);

export interface MenuSubmenuProps extends PropsWithChildren {
    label: ReactNode;
    className?: string;
}

@observer
export class MenuSubmenu extends Component<MenuSubmenuProps> {
    @observable accessor open = false;

    panel = createRef<HTMLDivElement>();

    @action
    setOpen = (open: boolean) => {
        this.open = open;
    };

    handleClick = () => this.setOpen(!this.open);

    handleMouseEnter = () => this.setOpen(true);

    handleMouseLeave = () => this.setOpen(false);

    handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const { key } = event;

        if (key === 'ArrowRight') {
            event.preventDefault();
            this.setOpen(true);
            queueMicrotask(() =>
                this.panel.current
                    ?.querySelector<HTMLElement>('a[href], button:not(:disabled)')
                    ?.focus()
            );
        }
        if (key === 'ArrowLeft' && this.open) {
            event.preventDefault();
            this.setOpen(false);
        }
    };

    render() {
        const { label, className, children } = this.props;
        const { open } = this;

        return (
            <div
                className={classNames('submenu', { show: open }, className)}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onKeyDown={this.handleKeyDown}
            >
                <Button
                    className="menu-item"
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={this.handleClick}
                >
                    {label}
                </Button>
                <div
                    ref={this.panel}
                    className={classNames('menu start-100 top-0', { show: open })}
                    hidden={!open}
                >
                    {children}
                </div>
            </div>
        );
    }
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    label: ReactNode;
    autoClose?: boolean | 'inside' | 'outside';
    align?: 'start' | 'end';
    menuClassName?: string;
    toggleProps?: Omit<
        Extract<ButtonProps, { href?: never }>,
        'children' | 'onClick' | 'onKeyDown'
    >;
    onOpenChange?: (open: boolean) => void;
}

@observer
export class Menu extends Component<MenuProps> {
    @observable accessor open = false;
    root = createRef<HTMLDivElement>();
    trigger = createRef<HTMLButtonElement>();
    panel = createRef<HTMLDivElement>();

    componentDidMount() {
        document.addEventListener('pointerdown', this.handleOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('pointerdown', this.handleOutside);
    }

    @action
    setOpen = (open: boolean) => {
        if (this.open === open) return;
        this.open = open;
        this.props.onOpenChange?.(open);
    };

    handleOutside = ({ target }: PointerEvent) => {
        const { autoClose = true } = this.props;
        if (
            autoClose !== false &&
            autoClose !== 'inside' &&
            target instanceof Node &&
            !this.root.current?.contains(target)
        )
            this.setOpen(false);
    };

    items() {
        return [
            ...(this.panel.current?.querySelectorAll<HTMLElement>(
                'a[href]:not([aria-disabled="true"]), button:not(:disabled):not([aria-disabled="true"])'
            ) ?? [])
        ].filter(item => !item.closest('[hidden]'));
    }

    handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        this.props.onKeyDown?.(event);

        const { key, defaultPrevented } = event;
        if (defaultPrevented) return;

        if (key === 'Escape' && this.open) {
            event.preventDefault();
            this.setOpen(false);
            return this.trigger.current?.focus();
        }
        if (key === 'Tab') return this.setOpen(false);
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return;

        event.preventDefault();
        this.setOpen(true);

        queueMicrotask(() => {
            const items = this.items();
            const index = items.findIndex(item => item === document.activeElement);

            let next = key === 'Home' ? 0 : items.length - 1;

            if (key === 'ArrowDown') next = (index + 1) % items.length;
            if (key === 'ArrowUp') next = index <= 0 ? items.length - 1 : index - 1;
            items[next]?.focus();
        });
    };

    handleBlur = (event: FocusEvent<HTMLDivElement>) => {
        const { onBlur, autoClose = true } = this.props;
        onBlur?.(event);

        const { defaultPrevented, currentTarget, relatedTarget } = event;
        if (
            !defaultPrevented &&
            autoClose !== false &&
            autoClose !== 'inside' &&
            !currentTarget.contains(relatedTarget)
        )
            this.setOpen(false);
    };

    handleToggle = () => this.setOpen(!this.open);

    handleSelect = ({ target }: MouseEvent<HTMLDivElement>) => {
        const { autoClose = true } = this.props;
        if (
            autoClose &&
            autoClose !== 'outside' &&
            target instanceof Element &&
            !target.closest('.submenu > .menu-item') &&
            target.closest('a[href], button:not(:disabled)')
        )
            this.setOpen(false);
    };

    render() {
        const {
            label,
            autoClose: _autoClose,
            align = 'end',
            menuClassName,
            toggleProps,
            onOpenChange: _onOpenChange,
            onKeyDown: _onKeyDown,
            onBlur: _onBlur,
            children,
            className,
            id,
            ...props
        } = this.props;
        const { open } = this;

        return (
            <div
                {...props}
                ref={this.root}
                id={id}
                className={classNames('position-relative', className)}
                onKeyDown={this.handleKeyDown}
                onBlur={this.handleBlur}
            >
                <Button
                    {...toggleProps}
                    ref={this.trigger}
                    aria-expanded={open}
                    aria-controls={id ? `${id}-menu` : undefined}
                    onClick={this.handleToggle}
                >
                    {label}
                </Button>
                <div
                    ref={this.panel}
                    id={id ? `${id}-menu` : undefined}
                    className={classNames(
                        'menu top-100',
                        align === 'end' ? 'end-0' : 'start-0',
                        { show: open },
                        menuClassName
                    )}
                    hidden={!open}
                    onClick={this.handleSelect}
                >
                    {children}
                </div>
            </div>
        );
    }
}
