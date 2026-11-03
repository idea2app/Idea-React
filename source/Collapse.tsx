'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ComponentPropsWithoutRef, createRef, HTMLAttributes, MouseEvent } from 'react';

import { Button, ButtonProps } from './Button';

const TOGGLE = 'idea-react:collapse-toggle';
const CHANGE = 'idea-react:collapse-change';
const OPEN = 'idea-react:collapse-open';

export interface CollapseProps extends ComponentPropsWithoutRef<'div'> {
    horizontal?: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    parent?: string;
    onOpenChange?: (open: boolean) => unknown;
}

@observer
export class Collapse extends Component<CollapseProps> {
    static displayName = 'Collapse';

    @observable accessor expanded = this.props.defaultOpen ?? false;

    root = createRef<HTMLDivElement>();

    get isOpen() {
        return this.props.open ?? this.expanded;
    }

    componentDidMount() {
        this.root.current!.addEventListener(TOGGLE, this.handleToggle);
        document.addEventListener(OPEN, this.handlePeerOpen);
        this.notify();
        if (this.isOpen) this.notifyOpen();
    }

    componentDidUpdate(previous: CollapseProps) {
        if (previous.open !== this.props.open && this.isOpen) this.notifyOpen();

        this.notify();
    }

    componentWillUnmount() {
        this.root.current!.removeEventListener(TOGGLE, this.handleToggle);
        document.removeEventListener(OPEN, this.handlePeerOpen);
    }

    notify = () => this.root.current!.dispatchEvent(new Event(CHANGE, { bubbles: true }));

    notifyOpen = () => this.root.current!.dispatchEvent(new Event(OPEN, { bubbles: true }));

    setOpen = action((open: boolean) => {
        if (open === this.isOpen) return;

        this.props.onOpenChange?.(open);

        if (this.props.open === undefined) {
            this.expanded = open;
            if (open) this.notifyOpen();
        }
    });

    handleToggle = (event: Event) => {
        if (event.target === this.root.current) this.setOpen(!this.isOpen);
    };

    handlePeerOpen = ({ target }: Event) => {
        const { parent } = this.props;
        const root = this.root.current;
        const group = parent ? root?.closest(parent) : null;

        if (
            parent &&
            group &&
            target instanceof Element &&
            target !== root &&
            target.closest(parent) === group
        )
            this.setOpen(false);
    };

    render() {
        const {
            open: _open,
            defaultOpen: _defaultOpen,
            parent: _parent,
            onOpenChange: _onOpenChange,
            horizontal,
            className,
            ...props
        } = this.props;

        return (
            <div
                {...props}
                ref={this.root}
                className={classNames(
                    'collapse',
                    { 'collapse-horizontal': horizontal, show: this.isOpen },
                    className
                )}
            />
        );
    }
}

export interface CollapseToggleProps
    extends
        HTMLAttributes<HTMLElement>,
        Pick<ButtonProps, 'variant' | 'theme' | 'size' | 'disabled' | 'icon' | 'styled'> {
    target: string;
    href?: string;
    type?: 'button' | 'submit' | 'reset';
}

@observer
export class CollapseToggle extends Component<CollapseToggleProps> {
    static displayName = 'CollapseToggle';

    @observable accessor expanded = false;
    @observable accessor controls = '';

    get targets() {
        return [...document.querySelectorAll<HTMLElement>(this.props.target)];
    }

    componentDidMount() {
        document.addEventListener(CHANGE, this.refresh);
        this.refresh();
    }

    componentDidUpdate(previous: CollapseToggleProps) {
        if (previous.target !== this.props.target) this.refresh();
    }

    componentWillUnmount() {
        document.removeEventListener(CHANGE, this.refresh);
    }

    refresh = action(() => {
        const { targets } = this;

        this.expanded = targets.some(element => element.classList.contains('show'));
        this.controls = targets
            .map(({ id }) => id)
            .filter(Boolean)
            .join(' ');
    });

    handleClick = (event: MouseEvent<HTMLElement>) => {
        this.props.onClick?.(event);

        if (event.defaultPrevented) return;

        event.preventDefault();

        for (const target of this.targets) target.dispatchEvent(new Event(TOGGLE));
    };

    render() {
        const { target: _target, href, ...props } = this.props;

        return (
            <Button
                {...props}
                role={props.role ?? 'button'}
                href={href}
                aria-controls={this.controls || undefined}
                aria-expanded={this.expanded}
                onClick={this.handleClick}
            />
        );
    }
}
