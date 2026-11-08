'use client';

import classNames from 'classnames';
import { observer } from 'mobx-react';
import {
    Children,
    cloneElement,
    Component,
    ComponentPropsWithRef,
    createRef,
    CSSProperties,
    ElementType,
    isValidElement,
    KeyboardEvent,
    MouseEvent,
    ReactElement,
    ReactNode
} from 'react';

import { Icon } from '../../Extension/Icon';
import { Menu, MenuProps } from '../Menu';
import { Nav, NavProps } from '../Nav';
import { AsProps, PolymorphicClassProps } from '../Polymorphic';
import { NavOverflowModel } from './model';

interface OverflowChildProps {
    'aria-hidden'?: boolean;
    className?: string;
    role?: string;
    style?: CSSProperties;
    tabIndex?: number;
}

export interface NavOverflowProps
    extends
        Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'children'>,
        Pick<NavProps, 'variant' | 'fill' | 'justified'> {
    children: ReactNode;
    collapseBelow?: number | string;
    id: string;
    iconPlacement?: 'start' | 'end';
    menuPlacement?: string;
    menuStrategy?: 'absolute' | 'fixed';
    minimumVisibleItems?: number;
    moreIcon?: ReactNode;
    moreText?: string | false;
    onOverflowChange?: (overflowCount: number, visibleCount: number) => unknown;
    threshold?: number;
}

@observer
export class NavOverflow<T extends ElementType | undefined = 'div'> extends Component<
    PolymorphicClassProps<T, NavOverflowProps>
> {
    declare readonly props: PolymorphicClassProps<T, NavOverflowProps>;

    protected get componentProps(): Readonly<NavOverflowProps & AsProps> {
        return this.props;
    }

    static displayName = 'NavOverflow';

    root = createRef<HTMLDivElement>();

    nav = createRef<HTMLElement>();

    toggleButton = createRef<HTMLButtonElement>();

    store = new NavOverflowModel();

    private resizeObserver?: ResizeObserver;

    componentDidMount() {
        this.updateOverflow();
        window.addEventListener('resize', this.updateOverflow);
        document.addEventListener('pointerdown', this.handleOutside);

        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(this.updateOverflow);

            if (this.root.current) this.resizeObserver.observe(this.root.current);
            if (this.nav.current) this.resizeObserver.observe(this.nav.current);

            for (const item of this.nav.current?.children ?? []) this.resizeObserver.observe(item);
        }
    }

    componentDidUpdate() {
        this.updateOverflow();
    }

    componentWillUnmount() {
        this.resizeObserver?.disconnect();
        window.removeEventListener('resize', this.updateOverflow);
        document.removeEventListener('pointerdown', this.handleOutside);
    }

    updateOverflow = () => {
        const root = this.root.current;
        const nav = this.nav.current;
        if (!root || !nav) return;

        const items = [...nav.children].filter(
            item => item !== this.toggleButton.current?.parentElement
        ) as HTMLElement[];
        const widths = items.map(item => item.getBoundingClientRect().width || item.offsetWidth);
        const gap = Number.parseFloat(getComputedStyle(nav).columnGap) || 0;
        const allWidth =
            widths.reduce((total, width) => total + width, 0) + gap * Math.max(0, items.length - 1);
        const toggleWidth =
            this.toggleButton.current?.getBoundingClientRect().width ||
            this.toggleButton.current?.offsetWidth ||
            0;
        const containerWidth = root.clientWidth;
        const collapseBelow = this.getCollapseBelow();
        const shouldCollapseAll =
            collapseBelow > 0 && containerWidth > 0 && containerWidth < collapseBelow;
        const keep = items.map(item => item.classList.contains('nav-overflow-keep'));
        const visible = items.map((_, index) => index);
        const minimum = Math.max(
            0,
            Math.min(
                this.componentProps.minimumVisibleItems ?? this.componentProps.threshold ?? 0,
                items.length
            )
        );
        let visibleWidth = allWidth;

        if (shouldCollapseAll) {
            for (let index = visible.length - 1; index >= 0; index--)
                if (!keep[index]) visible.splice(index, 1);
        } else if (containerWidth > 0 && allWidth > containerWidth)
            while (visibleWidth + toggleWidth > containerWidth && visible.length > minimum) {
                const index = visible.findLast(candidate => !keep[candidate]);
                if (index === undefined) break;

                visibleWidth -= widths[index] + (visible.length > 1 ? gap : 0);
                visible.splice(visible.indexOf(index), 1);
            }
        const visibleSet = new Set(visible);
        const overflowIndices = items
            .map((_, index) => index)
            .filter(index => !visibleSet.has(index));
        const current = this.store.overflowIndices;
        const changed =
            current.length !== overflowIndices.length ||
            current.some((index, position) => index !== overflowIndices[position]);

        if (!this.store.initialized || changed) this.store.setOverflowIndices(overflowIndices);
        if (changed) this.componentProps.onOverflowChange?.(overflowIndices.length, visible.length);
    };

    private getCollapseBelow = () => {
        const { collapseBelow = 0 } = this.componentProps;
        if (typeof collapseBelow === 'number') return collapseBelow;

        const value = getComputedStyle(this.root.current as HTMLElement).getPropertyValue(
            `--bs-breakpoint-${collapseBelow}`
        );
        return Number.parseFloat(value) || 0;
    };

    handleClick = (event: MouseEvent<HTMLDivElement>) => {
        this.componentProps.onClick?.(event);

        const target = event.target instanceof Element ? event.target : null;
        if (event.defaultPrevented) return;

        if (target?.closest('[data-overflow-toggle]')) this.store.toggle();
        else if (target?.closest('.nav-overflow-menu') && !target.closest('[aria-haspopup="true"]'))
            this.store.setOpen(false);
    };

    handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        this.componentProps.onKeyDown?.(event);
        if (event.defaultPrevented) return;

        if (event.key === 'Escape' && this.store.open) {
            this.store.setOpen(false);
            this.toggleButton.current?.focus();
        } else if (event.key === 'ArrowDown' && event.target === this.toggleButton.current) {
            event.preventDefault();
            this.store.setOpen(true);

            queueMicrotask(() =>
                this.root.current
                    ?.querySelector<HTMLElement>(
                        '.nav-overflow-menu a[href]:not([aria-disabled="true"]), .nav-overflow-menu button:not(:disabled)'
                    )
                    ?.focus()
            );
        }
    };

    handleOutside = (event: PointerEvent) => {
        if (event.target instanceof Node && !this.root.current?.contains(event.target))
            this.store.setOpen(false);
    };

    renderChild = (child: ReactNode, index: number, overflow = false) => {
        if (!isValidElement<OverflowChildProps>(child)) return <span key={index}>{child}</span>;

        if (overflow) {
            if (child.type === Menu)
                return cloneElement(child as ReactElement<MenuProps>, {
                    className: classNames(child.props.className, 'nav-overflow-submenu')
                });
            return cloneElement(child as ReactElement<OverflowChildProps>, {
                className: classNames(child.props.className, 'menu-item'),
                role: 'menuitem'
            });
        }
        const hidden = this.store.overflowIndices.includes(index);

        return cloneElement(child as ReactElement<OverflowChildProps>, {
            className: classNames(child.props.className, hidden && 'position-absolute invisible'),
            'aria-hidden': hidden || undefined,
            tabIndex: hidden ? -1 : child.props.tabIndex
        });
    };

    render() {
        const Root: ElementType = this.componentProps.as ?? 'div';

        const {
            as: _as,
            children,
            className,
            collapseBelow: _collapseBelow,
            fill,
            iconPlacement = 'start',
            justified,
            menuPlacement = 'bottom-end',
            menuStrategy = 'absolute',
            minimumVisibleItems: _minimumVisibleItems,
            moreIcon,
            moreText = 'More',
            onClick: _onClick,
            onKeyDown: _onKeyDown,
            onOverflowChange: _onOverflowChange,
            threshold: _threshold,
            'aria-label': ariaLabel,
            variant,
            ...props
        } = this.componentProps;
        const items = Children.toArray(children);
        const hasOverflow = this.store.overflowIndices.length > 0;
        const menuId = `${this.componentProps.id}-menu`;
        const [vertical, horizontal] = menuPlacement.split('-');
        const placementClasses =
            vertical === 'top'
                ? ['bottom-100', horizontal === 'end' ? 'end-0' : 'start-0']
                : vertical === 'bottom'
                  ? ['top-100', horizontal === 'end' ? 'end-0' : 'start-0']
                  : vertical === 'left'
                    ? ['end-100', horizontal === 'end' ? 'bottom-0' : 'top-0']
                    : ['start-100', horizontal === 'end' ? 'bottom-0' : 'top-0'];
        const icon = moreIcon ?? <Icon name="three-dots" aria-hidden="true" />;
        const text = moreText === false ? null : moreText;

        return (
            <Root
                {...props}
                ref={this.root}
                className={classNames(
                    'nav-overflow d-flex align-items-start position-relative',
                    this.store.initialized && 'nav-overflow-initialized',
                    className
                )}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
            >
                <Nav
                    ref={this.nav}
                    variant={variant}
                    fill={fill}
                    justified={justified}
                    aria-label={ariaLabel}
                    className="flex-nowrap flex-grow-1"
                >
                    {items.map((child, index) => this.renderChild(child, index))}
                    <div
                        className={classNames(
                            'nav-item nav-overflow-item flex-shrink-0',
                            !hasOverflow && 'position-absolute invisible'
                        )}
                        data-menu-placement={menuPlacement}
                    >
                        <button
                            ref={this.toggleButton}
                            type="button"
                            className="nav-link"
                            aria-haspopup="menu"
                            aria-expanded={this.store.open}
                            aria-controls={menuId}
                            aria-label={text ? undefined : 'More'}
                            data-overflow-toggle
                        >
                            {iconPlacement === 'start' && icon}
                            {text}
                            {iconPlacement === 'end' && icon}
                        </button>
                        <div
                            id={menuId}
                            className={classNames(
                                'menu nav-overflow-menu',
                                placementClasses,
                                menuStrategy === 'fixed' && 'position-fixed',
                                { show: this.store.open && hasOverflow }
                            )}
                            role="menu"
                            hidden={!this.store.open || !hasOverflow}
                        >
                            {this.store.overflowIndices.map(index =>
                                this.renderChild(items[index], index, true)
                            )}
                        </div>
                    </div>
                </Nav>
            </Root>
        );
    }
}
