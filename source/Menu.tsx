'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    Component,
    createRef,
    ElementType,
    FocusEvent,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    ReactNode
} from 'react';

import { Button, ButtonProps } from './Button';
import { Icon, IconProps } from './Extension/Icon';
import { Breakpoint } from './Grid';
import { FloatingOptions, FloatingPosition } from './Overlay';
import { AsProps, polymorphic, PolymorphicClassProps } from './Polymorphic';

export type MenuItemProps = ButtonProps & { active?: boolean; selected?: boolean };

export const MenuItem = polymorphic<MenuItemProps>(
    ({ as: RootAs, active, selected, className, ...props }) => (
        <Button
            as={RootAs}
            {...props}
            aria-current={active || (selected && props.href) ? 'true' : props['aria-current']}
            aria-pressed={props.href ? props['aria-pressed'] : (selected ?? props['aria-pressed'])}
            className={classNames('menu-item', { active, selected }, className)}
        />
    )
);

export interface MenuPanelProps extends HTMLAttributes<HTMLDivElement> {
    theme?: 'light' | 'dark';
    translucent?: boolean;
    scrollable?: boolean;
    show?: boolean;
}

export const MenuPanel = polymorphic<MenuPanelProps>(
    ({ as: Root = 'div', theme, translucent, scrollable, show, className, ...props }) => (
        <Root
            {...props}
            data-bs-theme={theme}
            className={classNames(
                'menu',
                { show },
                translucent && 'menu-translucent',
                scrollable && 'menu-scrollable',
                className
            )}
        />
    )
);

export const MenuItemIcon = polymorphic<IconProps>(({ as: RootAs, className, ...props }) => (
    <Icon
        as={RootAs}
        aria-hidden="true"
        {...props}
        className={classNames('menu-item-icon', className)}
    />
));

export const MenuItemCheck = polymorphic<Omit<IconProps, 'name'>>(
    ({ as: RootAs, className, ...props }) => (
        <Icon
            as={RootAs}
            aria-hidden="true"
            {...props}
            name="check"
            className={classNames('menu-item-check', className)}
        />
    )
);

export const MenuText = polymorphic<HTMLAttributes<HTMLSpanElement>>(
    ({ as: Root = 'span', className, ...props }) => (
        <Root {...props} className={classNames('menu-text', className)} />
    )
);

export const MenuHeader = polymorphic<HTMLAttributes<HTMLHeadingElement>>(
    ({ as: Root = 'h6', className, ...props }) => (
        <Root {...props} className={classNames('menu-header', className)} />
    )
);

export const MenuDivider = polymorphic<HTMLAttributes<HTMLHRElement>>(
    ({ as: Root = 'hr', className, ...props }) => (
        <Root {...props} className={classNames('menu-divider', className)} />
    )
);

export const MenuItemContent = polymorphic<HTMLAttributes<HTMLSpanElement>>(
    ({ as: Root = 'span', className, ...props }) => (
        <Root {...props} className={classNames('menu-item-content', className)} />
    )
);

export const MenuItemDescription = polymorphic<HTMLAttributes<HTMLElement>>(
    ({ as: Root = 'small', className, ...props }) => (
        <Root {...props} className={classNames('menu-item-description', className)} />
    )
);

export interface MenuSubmenuProps extends HTMLAttributes<HTMLDivElement> {
    label: ReactNode;
    className?: string;
}

@observer
export class MenuSubmenu<T extends ElementType | undefined = 'div'> extends Component<
    PolymorphicClassProps<T, MenuSubmenuProps>
> {
    declare readonly props: PolymorphicClassProps<T, MenuSubmenuProps>;

    protected get componentProps(): Readonly<MenuSubmenuProps & AsProps> {
        return this.props;
    }

    @observable accessor open = false;

    panel = createRef<HTMLDivElement>();
    trigger = createRef<HTMLButtonElement>();
    position = new FloatingPosition();

    componentDidUpdate() {
        const { position, panel, trigger } = this;

        if (!this.open) return position.dispose();
        if (!panel.current || !trigger.current) return;

        if (position.element !== panel.current)
            position.attach(trigger.current, panel.current, {
                placement: 'right-start',
                offset: 2
            });
        else position.update();
    }

    componentWillUnmount() {
        this.position.dispose();
    }

    @action
    setOpen = (open: boolean) => (this.open = open);

    handleClick = () => this.setOpen(!this.open);

    handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
        this.componentProps.onMouseEnter?.(event);

        if (!event.defaultPrevented) this.setOpen(true);
    };

    handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
        this.componentProps.onMouseLeave?.(event);

        if (!event.defaultPrevented) this.setOpen(false);
    };

    handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        this.componentProps.onKeyDown?.(event);

        if (event.defaultPrevented) return;

        const { key } = event;

        if (key === 'ArrowRight') {
            event.preventDefault();
            event.stopPropagation();
            this.setOpen(true);

            queueMicrotask(() =>
                this.panel.current
                    ?.querySelector<HTMLElement>('a[href], button:not(:disabled)')
                    ?.focus()
            );
        }
        if ((key === 'ArrowLeft' || key === 'Escape') && this.open) {
            event.preventDefault();
            event.stopPropagation();

            this.setOpen(false);
            this.trigger.current?.focus();
        }
    };

    render() {
        const Root: ElementType = this.componentProps.as ?? 'div';

        const { as: _as, label, className, children, ...props } = this.componentProps;
        const { open } = this;

        return (
            <Root
                {...props}
                className={classNames('submenu', { show: open }, className)}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onKeyDown={this.handleKeyDown}
            >
                <Button
                    ref={this.trigger}
                    className="menu-item"
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={this.handleClick}
                >
                    {label}
                </Button>
                <div
                    ref={this.panel}
                    style={{ ...this.position.style }}
                    data-bs-placement={this.position.placement}
                    className={classNames('menu start-100 top-0', { show: open })}
                    hidden={!open}
                >
                    {children}
                </div>
            </Root>
        );
    }
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    label: ReactNode;
    autoClose?: boolean | 'inside' | 'outside';
    align?: 'start' | 'end';
    menuClassName?: string;
    placement?: MenuPlacement;
    responsivePlacement?: Partial<Record<Breakpoint, MenuPlacement>>;
    theme?: 'light' | 'dark';
    translucent?: boolean;
    scrollable?: boolean;
    split?: boolean;
    nav?: boolean;
    offset?: FloatingOptions['offset'];
    padding?: number;
    flip?: boolean;
    toggleProps?: Omit<
        Extract<ButtonProps, { href?: never }>,
        'children' | 'onClick' | 'onKeyDown'
    >;
    onOpenChange?: (open: boolean) => unknown;
}

export type MenuPlacement =
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end';

const MENU_PLACEMENT_CLASSES: Record<MenuPlacement, string[]> = {
    'top-start': ['bottom-100', 'start-0'],
    'top-end': ['bottom-100', 'end-0'],
    'bottom-start': ['top-100', 'start-0'],
    'bottom-end': ['top-100', 'end-0'],
    'left-start': ['end-100', 'top-0'],
    'left-end': ['end-100', 'bottom-0'],
    'right-start': ['start-100', 'top-0'],
    'right-end': ['start-100', 'bottom-0']
};

const MENU_BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
    sm: 576,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
};

@observer
export class Menu<T extends ElementType | undefined = 'div'> extends Component<
    PolymorphicClassProps<T, MenuProps>
> {
    declare readonly props: PolymorphicClassProps<T, MenuProps>;

    protected get componentProps(): Readonly<MenuProps & AsProps> {
        return this.props;
    }

    @observable accessor open = false;
    @observable accessor responsiveDirection: MenuPlacement | undefined;

    root = createRef<HTMLDivElement>();
    trigger = createRef<HTMLButtonElement>();
    panel = createRef<HTMLDivElement>();
    media: { query: MediaQueryList; placement: MenuPlacement }[] = [];
    position = new FloatingPosition();

    componentDidMount() {
        document.addEventListener('pointerdown', this.handleOutside);
        this.observePlacement();
    }

    componentDidUpdate({ responsivePlacement }: MenuProps) {
        if (responsivePlacement !== this.componentProps.responsivePlacement)
            this.observePlacement();
        const { trigger, panel, position, componentProps: props } = this;
        if (!this.open) return position.dispose();
        if (!trigger.current || !panel.current) return;

        const { placement, align, offset, padding, flip } = props;

        const options: FloatingOptions = {
            placement: this.responsiveDirection ?? placement ?? `bottom-${align ?? 'end'}`,
            offset,
            padding,
            flip
        };
        if (position.element !== panel.current)
            position.attach(trigger.current, panel.current, options);
        else {
            position.options = options;
            position.update();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('pointerdown', this.handleOutside);
        this.position.dispose();

        for (const { query } of this.media)
            query.removeEventListener('change', this.handlePlacement);
    }

    observePlacement = () => {
        for (const { query } of this.media)
            query.removeEventListener('change', this.handlePlacement);

        this.media = (Object.keys(MENU_BREAKPOINT_WIDTHS) as Breakpoint[]).flatMap(breakpoint => {
            const placement = this.componentProps.responsivePlacement?.[breakpoint];
            if (!placement) return [];

            const query = window.matchMedia(`(min-width: ${MENU_BREAKPOINT_WIDTHS[breakpoint]}px)`);
            query.addEventListener('change', this.handlePlacement);
            return [{ query, placement }];
        });
        this.handlePlacement();
    };

    @action
    handlePlacement = () =>
        (this.responsiveDirection = [...this.media]
            .reverse()
            .find(({ query }) => query.matches)?.placement);

    @action
    setOpen = (open: boolean) => {
        if (this.open === open) return;
        this.open = open;
        this.componentProps.onOpenChange?.(open);
    };

    handleOutside = ({ target }: PointerEvent) => {
        const { autoClose = true } = this.componentProps;
        if (
            autoClose !== false &&
            autoClose !== 'inside' &&
            target instanceof Node &&
            !this.root.current?.contains(target)
        )
            this.setOpen(false);
    };

    items(panel: HTMLElement | null = this.panel.current) {
        return [
            ...(panel?.querySelectorAll<HTMLElement>(
                'a[href]:not([aria-disabled="true"]), button:not(:disabled):not([aria-disabled="true"])'
            ) ?? [])
        ].filter(item => !item.closest('[hidden]') && item.closest('.menu') === panel);
    }

    handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        this.componentProps.onKeyDown?.(event);

        const { key, defaultPrevented } = event;
        if (defaultPrevented) return;

        if (key === 'Escape' && this.open) {
            event.preventDefault();
            this.setOpen(false);
            return this.trigger.current?.focus();
        }
        if (key === 'Tab') return this.setOpen(false);
        if (
            event.target instanceof Element &&
            event.target.matches('input, textarea, select, [contenteditable="true"]')
        )
            return;

        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return;

        event.preventDefault();
        this.setOpen(true);

        queueMicrotask(() => {
            const panel =
                event.target instanceof Element
                    ? event.target.closest<HTMLElement>('.menu')
                    : undefined;
            const items = this.items(panel ?? this.panel.current);
            const index = items.findIndex(item => item === document.activeElement);

            let next = key === 'Home' ? 0 : items.length - 1;

            if (key === 'ArrowDown') next = (index + 1) % items.length;
            if (key === 'ArrowUp') next = index <= 0 ? items.length - 1 : index - 1;
            items[next]?.focus();
        });
    };

    handleBlur = (event: FocusEvent<HTMLDivElement>) => {
        const { onBlur, autoClose = true } = this.componentProps;
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

    handleSelect = ({ target, defaultPrevented }: MouseEvent<HTMLDivElement>) => {
        const { autoClose = true } = this.componentProps;
        if (
            autoClose &&
            !defaultPrevented &&
            autoClose !== 'outside' &&
            target instanceof Element &&
            !target.closest('.submenu > .menu-item') &&
            target.closest('a[href], button:not(:disabled)')
        )
            this.setOpen(false);
    };

    render() {
        const Root: ElementType = this.componentProps.as ?? 'div';

        const {
            as: _as,
            label,
            autoClose: _autoClose,
            align = 'end',
            placement,
            responsivePlacement: _responsivePlacement,
            theme,
            translucent,
            scrollable,
            split,
            nav,
            offset: _offset,
            padding: _padding,
            flip: _flip,
            menuClassName,
            toggleProps,
            onOpenChange: _onOpenChange,
            onKeyDown: _onKeyDown,
            onBlur: _onBlur,
            children,
            className,
            id,
            ...props
        } = this.componentProps;
        const { open } = this;
        const preferred = this.responsiveDirection ?? placement;
        const direction = this.position.element
            ? (this.position.placement as MenuPlacement)
            : preferred;
        const placementClasses = direction
            ? MENU_PLACEMENT_CLASSES[direction]
            : ['top-100', align === 'end' ? 'end-0' : 'start-0'];

        return (
            <Root
                {...props}
                ref={this.root}
                id={id}
                data-bs-theme={theme}
                className={classNames(
                    split ? 'btn-group' : 'd-inline-block',
                    'position-relative',
                    className
                )}
                onKeyDown={this.handleKeyDown}
                onBlur={this.handleBlur}
            >
                <Button
                    variant={nav ? false : undefined}
                    {...toggleProps}
                    ref={this.trigger}
                    aria-expanded={open}
                    aria-haspopup="true"
                    className={classNames(
                        toggleProps?.className,
                        split && 'menu-toggle-split',
                        nav && 'nav-link'
                    )}
                    aria-controls={id ? `${id}-menu` : undefined}
                    onClick={this.handleToggle}
                >
                    {label}
                </Button>
                <div
                    ref={this.panel}
                    id={id ? `${id}-menu` : undefined}
                    data-bs-placement={direction ?? `bottom-${align}`}
                    style={{ ...this.position.style }}
                    className={classNames(
                        'menu',
                        placementClasses,
                        translucent && 'menu-translucent',
                        scrollable && 'menu-scrollable',
                        { show: open },
                        menuClassName
                    )}
                    hidden={!open}
                    onClick={this.handleSelect}
                >
                    {children}
                </div>
            </Root>
        );
    }
}

MenuItem.displayName = 'MenuItem';

MenuPanel.displayName = 'MenuPanel';

MenuItemIcon.displayName = 'MenuItemIcon';

MenuItemCheck.displayName = 'MenuItemCheck';

MenuText.displayName = 'MenuText';

MenuHeader.displayName = 'MenuHeader';

MenuDivider.displayName = 'MenuDivider';

MenuItemContent.displayName = 'MenuItemContent';

MenuItemDescription.displayName = 'MenuItemDescription';
