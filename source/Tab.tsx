'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    Children,
    cloneElement,
    Component,
    ComponentPropsWithRef,
    createRef,
    ElementType,
    isValidElement,
    KeyboardEvent,
    MouseEvent,
    ReactNode
} from 'react';

import { AsProps, polymorphic, PolymorphicClassProps } from './Polymorphic';

export interface TabProps extends ComponentPropsWithRef<'div'> {
    eventKey: string;
    label: ReactNode;
    disabled?: boolean;
}

export const Tab = polymorphic<TabProps>(
    ({ as: Root = 'div', eventKey: _eventKey, label: _label, disabled: _disabled, ...props }) => (
        <Root {...props} />
    )
);
Tab.displayName = 'Tab';

export interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
    activeKey?: string;
    defaultActiveKey?: string;
    fade?: boolean;
    id: string;
    onChange?: (key: string) => unknown;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'tabs' | 'pills' | 'underline' | 'list-group';
}

@observer
export class Tabs<T extends ElementType | undefined = 'div'> extends Component<
    PolymorphicClassProps<T, TabsProps>
> {
    static displayName = 'Tabs';

    declare readonly props: PolymorphicClassProps<T, TabsProps>;

    protected get componentProps(): Readonly<TabsProps & AsProps> {
        return this.props;
    }

    get tabs() {
        return Children.toArray(this.componentProps.children)
            .filter(child => typeof child !== 'string' || child.trim())
            .map(child => {
                // Server component boundaries may wrap Tab in a lazy client reference.
                if (
                    !isValidElement<TabProps>(child) ||
                    typeof child.props.eventKey !== 'string' ||
                    !('label' in child.props)
                )
                    throw new TypeError('Tabs children must be Tab elements.');

                return child;
            });
    }

    root = createRef<HTMLDivElement>();

    @observable accessor selectedKey =
        this.componentProps.defaultActiveKey ??
            this.tabs.find(({ props }) => !props.disabled)?.props.eventKey ??
            this.tabs[0]?.props.eventKey ??
            '';

    get activeKey() {
        const key = this.componentProps.activeKey ?? this.selectedKey;

        return this.tabs.some(({ props }) => props.eventKey === key && !props.disabled)
            ? key
            : (this.tabs.find(({ props }) => !props.disabled)?.props.eventKey ?? '');
    }

    handleClick = (event: MouseEvent<HTMLDivElement>) => {
        this.componentProps.onClick?.(event);

        if (event.defaultPrevented) return;

        const button = (event.target as Element).closest<HTMLButtonElement>('[data-tab-index]');
        const tab = button && this.tabs[Number(button.dataset.tabIndex)]?.props;

        if (!tab || tab.disabled) return;

        this.activate(tab.eventKey);
    };

    handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        this.componentProps.onKeyDown?.(event);

        if (event.defaultPrevented) return;

        const button = (event.target as Element).closest<HTMLButtonElement>('[data-tab-index]');
        const index = Number(button?.dataset.tabIndex);
        const { tabs } = this;
        if (!button || Number.isNaN(index)) return;

        const horizontal = this.componentProps.orientation !== 'vertical';
        const previous = horizontal ? event.key === 'ArrowLeft' : event.key === 'ArrowUp';
        const next = horizontal ? event.key === 'ArrowRight' : event.key === 'ArrowDown';
        const enabled = tabs
            .map(({ props }, tabIndex) => (props.disabled ? -1 : tabIndex))
            .filter(tabIndex => tabIndex >= 0);
        const currentPosition = enabled.indexOf(index);
        const destination =
            event.key === 'Home'
                ? enabled[0]
                : event.key === 'End'
                  ? enabled.at(-1)
                  : previous
                    ? enabled[(currentPosition - 1 + enabled.length) % enabled.length]
                    : next
                      ? enabled[(currentPosition + 1) % enabled.length]
                      : undefined;
        if (destination === undefined) return;

        event.preventDefault();
        const tab = tabs[destination];

        this.activate(tab.props.eventKey);
        this.root.current
            ?.querySelector<HTMLButtonElement>(`[data-tab-index="${destination}"]`)
            ?.focus();
    };

    @action
    activate = (key: string) => {
        this.componentProps.onChange?.(key);

        if (this.componentProps.activeKey === undefined) this.selectedKey = key;
    };

    tabId = (key: string) => `${this.componentProps.id}-tab-${encodeURIComponent(key)}`;

    panelId = (key: string) => `${this.componentProps.id}-panel-${encodeURIComponent(key)}`;

    renderTabs = () => {
        const { orientation = 'horizontal', variant = 'tabs' } = this.componentProps;
        const listGroup = variant === 'list-group';

        return (
            <div
                className={classNames(
                    listGroup ? 'list-group' : 'nav',
                    !listGroup && `nav-${variant}`,
                    orientation === 'vertical' &&
                        (listGroup
                            ? 'flex-column'
                            : variant === 'pills'
                              ? 'nav-pills-vertical'
                              : 'flex-column')
                )}
                role="tablist"
                aria-label={this.componentProps['aria-label'] ?? 'Tabs'}
                aria-orientation={orientation}
            >
                {this.tabs.map(({ props: tab }, index) => {
                    const active = tab.eventKey === this.activeKey;

                    return (
                        <button
                            key={tab.eventKey}
                            id={this.tabId(tab.eventKey)}
                            type="button"
                            role="tab"
                            data-tab-index={index}
                            aria-controls={this.panelId(tab.eventKey)}
                            aria-selected={active}
                            aria-disabled={tab.disabled || undefined}
                            tabIndex={active ? 0 : -1}
                            disabled={tab.disabled}
                            className={classNames(
                                listGroup ? 'list-group-item list-group-item-action' : 'nav-link',
                                { active },
                                tab.disabled && 'disabled'
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        );
    };

    renderPanels = () => {
        const { fade = true } = this.componentProps;

        return (
            <div className="tab-content">
                {this.tabs.map(tab => {
                    const { eventKey, className } = tab.props;
                    const active = eventKey === this.activeKey;

                    return cloneElement(tab, {
                        key: eventKey,
                        id: this.panelId(eventKey),
                        role: 'tabpanel',
                        'aria-labelledby': this.tabId(eventKey),
                        'aria-hidden': !active,
                        tabIndex: tab.props.tabIndex ?? 0,
                        className: classNames(
                            'tab-pane',
                            { active, show: active && fade },
                            !fade && 'tab-pane-instant',
                            className
                        ),
                        hidden: !active
                    });
                })}
            </div>
        );
    };

    render() {
        const Root: ElementType = this.componentProps.as ?? 'div';

        const {
            as: _as,
            activeKey: _activeKey,
            className,
            defaultActiveKey: _defaultActiveKey,
            fade: _fade,
            onChange: _onChange,
            onClick: _onClick,
            onKeyDown: _onKeyDown,
            id: _id,
            orientation: _orientation,
            children: _children,
            variant: _variant,
            ...props
        } = this.componentProps;

        return (
            <Root
                {...props}
                ref={this.root}
                id={this.componentProps.id}
                className={className}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
            >
                {this.renderTabs()}
                {this.renderPanels()}
            </Root>
        );
    }
}
