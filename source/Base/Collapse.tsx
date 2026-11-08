'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    Component,
    ComponentPropsWithoutRef,
    createRef,
    ElementType,
    HTMLAttributes,
    MouseEvent
} from 'react';

import { ButtonProps } from './Button';
import { AsProps, PolymorphicClassProps } from './Polymorphic';

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
export class Collapse<T extends ElementType | undefined = 'div'> extends Component<
    PolymorphicClassProps<T, CollapseProps>
> {
    declare readonly props: PolymorphicClassProps<T, CollapseProps>;

    protected get componentProps(): Readonly<CollapseProps & AsProps> {
        return this.props;
    }

    static displayName = 'Collapse';

    @observable accessor expanded = this.componentProps.defaultOpen ?? false;

    root = createRef<HTMLDivElement>();

    get isOpen() {
        return this.componentProps.open ?? this.expanded;
    }

    componentDidMount() {
        this.root.current!.addEventListener(TOGGLE, this.handleToggle);
        document.addEventListener(OPEN, this.handlePeerOpen);
        this.notify();
        if (this.isOpen) this.notifyOpen();
    }

    componentDidUpdate(previous: CollapseProps) {
        if (previous.open !== this.componentProps.open && this.isOpen) this.notifyOpen();

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

        this.componentProps.onOpenChange?.(open);

        if (this.componentProps.open === undefined) {
            this.expanded = open;
            if (open) this.notifyOpen();
        }
    });

    handleToggle = (event: Event) => {
        if (event.target === this.root.current) this.setOpen(!this.isOpen);
    };

    handlePeerOpen = ({ target }: Event) => {
        const { parent } = this.componentProps;
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
        const Root: ElementType = this.componentProps.as ?? 'div';

        const {
            as: _as,
            open: _open,
            defaultOpen: _defaultOpen,
            parent: _parent,
            onOpenChange: _onOpenChange,
            horizontal,
            className,
            ...props
        } = this.componentProps;

        return (
            <Root
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
export class CollapseToggle<T extends ElementType | undefined = 'button'> extends Component<
    PolymorphicClassProps<T, CollapseToggleProps>
> {
    declare readonly props: PolymorphicClassProps<T, CollapseToggleProps>;

    protected get componentProps(): Readonly<PolymorphicClassProps<T, CollapseToggleProps>> {
        return this.props;
    }

    static displayName = 'CollapseToggle';

    @observable accessor expanded = false;
    @observable accessor controls = '';

    get targets() {
        return [...document.querySelectorAll<HTMLElement>(this.componentProps.target)];
    }

    componentDidMount() {
        document.addEventListener(CHANGE, this.refresh);
        this.refresh();
    }

    componentDidUpdate(previous: CollapseToggleProps) {
        if (previous.target !== this.componentProps.target) this.refresh();
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
        this.componentProps.onClick?.(event);

        if (event.defaultPrevented) return;

        event.preventDefault();
        if (this.componentProps.disabled) return;

        for (const target of this.targets) target.dispatchEvent(new Event(TOGGLE));
    };

    render() {
        const {
            as: RootAs,
            target: _target,
            href,
            type = 'button',
            variant,
            theme,
            size,
            disabled,
            icon,
            styled,
            className,
            ...props
        } = this.componentProps;
        const Root: ElementType = RootAs ?? (href ? 'a' : 'button');
        const nativeButton = Root === 'button';
        const rootClassName = classNames(
            variant === false ? undefined : variant ? `btn-${variant}` : icon ? undefined : 'btn',
            theme && `theme-${theme}`,
            size && `btn-${size}`,
            { 'btn-icon': icon, 'btn-styled': styled, disabled },
            className
        );

        return (
            <Root
                {...props}
                type={nativeButton ? type : undefined}
                href={disabled ? undefined : href}
                disabled={nativeButton || typeof Root !== 'string' ? disabled : undefined}
                aria-disabled={(!nativeButton && disabled) || undefined}
                tabIndex={!nativeButton && disabled ? -1 : props.tabIndex}
                className={rootClassName}
                role={props.role ?? 'button'}
                aria-controls={this.controls || undefined}
                aria-expanded={this.expanded}
                onClick={this.handleClick}
            />
        );
    }
}
