'use client';

import classNames from 'classnames';
import { observer } from 'mobx-react';
import {
    Component,
    ComponentPropsWithRef,
    createRef,
    KeyboardEvent,
    MouseEvent,
    ReactNode
} from 'react';

import { TabModel } from './model';

export interface TabItem {
    key: string;
    label: ReactNode;
    content: ReactNode;
    disabled?: boolean;
}

export interface TabProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'children'> {
    activeKey?: string;
    defaultActiveKey?: string;
    fade?: boolean;
    id: string;
    onChange?: (key: string) => unknown;
    orientation?: 'horizontal' | 'vertical';
    tabs: TabItem[];
    variant?: 'tabs' | 'pills' | 'underline' | 'list-group';
}

@observer
export class Tab extends Component<TabProps> {
    static displayName = 'Tab';

    root = createRef<HTMLDivElement>();

    store = new TabModel(
        this.props.defaultActiveKey ??
            this.props.tabs.find(tab => !tab.disabled)?.key ??
            this.props.tabs[0]?.key ??
            ''
    );

    get activeKey() {
        const key = this.props.activeKey ?? this.store.activeKey;
        return this.props.tabs.some(tab => tab.key === key && !tab.disabled)
            ? key
            : (this.props.tabs.find(tab => !tab.disabled)?.key ?? '');
    }

    handleClick = (event: MouseEvent<HTMLDivElement>) => {
        this.props.onClick?.(event);
        if (event.defaultPrevented) return;

        const button = (event.target as Element).closest<HTMLButtonElement>('[data-tab-index]');
        const tab = button && this.props.tabs[Number(button.dataset.tabIndex)];
        if (!tab || tab.disabled) return;

        this.activate(tab.key);
    };

    handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        this.props.onKeyDown?.(event);

        const button = (event.target as Element).closest<HTMLButtonElement>('[data-tab-index]');
        const index = Number(button?.dataset.tabIndex);
        const tabs = this.props.tabs;
        if (!button || Number.isNaN(index)) return;

        const horizontal = this.props.orientation !== 'vertical';
        const previous = horizontal ? event.key === 'ArrowLeft' : event.key === 'ArrowUp';
        const next = horizontal ? event.key === 'ArrowRight' : event.key === 'ArrowDown';
        const enabled = tabs
            .map((tab, tabIndex) => (tab.disabled ? -1 : tabIndex))
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
        this.activate(tab.key);
        this.root.current
            ?.querySelector<HTMLButtonElement>(`[data-tab-index="${destination}"]`)
            ?.focus();
    };

    activate = (key: string) => {
        this.props.onChange?.(key);

        if (this.props.activeKey === undefined) this.store.select(key);
    };

    tabId = (key: string) => `${this.props.id}-tab-${encodeURIComponent(key)}`;

    panelId = (key: string) => `${this.props.id}-panel-${encodeURIComponent(key)}`;

    renderTabs = () => {
        const { orientation = 'horizontal', tabs, variant = 'tabs' } = this.props;
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
                aria-label={this.props['aria-label'] ?? 'Tabs'}
                aria-orientation={orientation}
            >
                {tabs.map((tab, index) => {
                    const active = tab.key === this.activeKey;

                    return (
                        <button
                            key={tab.key}
                            id={this.tabId(tab.key)}
                            type="button"
                            role="tab"
                            data-tab-index={index}
                            aria-controls={this.panelId(tab.key)}
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
        const { fade = true, tabs } = this.props;

        return (
            <div className="tab-content">
                {tabs.map(tab => {
                    const active = tab.key === this.activeKey;

                    return (
                        <div
                            key={tab.key}
                            id={this.panelId(tab.key)}
                            role="tabpanel"
                            aria-labelledby={this.tabId(tab.key)}
                            aria-hidden={!active}
                            tabIndex={0}
                            className={classNames(
                                'tab-pane',
                                { active, show: active && fade },
                                !fade && 'tab-pane-instant'
                            )}
                            hidden={!active}
                        >
                            {tab.content}
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const {
            activeKey: _activeKey,
            className,
            defaultActiveKey: _defaultActiveKey,
            fade: _fade,
            onChange: _onChange,
            onClick: _onClick,
            onKeyDown: _onKeyDown,
            id: _id,
            orientation: _orientation,
            tabs: _tabs,
            variant: _variant,
            ...props
        } = this.props;

        return (
            <div
                {...props}
                ref={this.root}
                id={this.props.id}
                className={className}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
            >
                {this.renderTabs()}
                {this.renderPanels()}
            </div>
        );
    }
}
