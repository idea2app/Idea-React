'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, MouseEvent, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '../../../source/Base/Button';
import { Drawer } from '../../../source/Base/Drawer';
import { Icon } from '../../../source/Extension/Icon';
import { DocumentToc } from './Toc';

@observer
export class DocumentNavigation extends Component<PropsWithChildren> {
    static displayName = 'DocumentNavigation';

    @observable accessor headerTarget: HTMLElement | null = null;
    @observable accessor navigationOpen = false;
    @observable accessor tocOpen = false;

    desktop?: MediaQueryList;

    @action
    componentDidMount() {
        this.headerTarget = document.getElementById('documentation-navigation-toggle');
        this.desktop = window.matchMedia('(min-width: 1024px)');
        this.desktop.addEventListener('change', this.handleBreakpoint);
    }

    componentWillUnmount() {
        this.desktop?.removeEventListener('change', this.handleBreakpoint);
    }

    showNavigation = action(() => (this.navigationOpen = true));
    hideNavigation = action(() => (this.navigationOpen = false));
    showToc = action(() => (this.tocOpen = true));
    hideToc = action(() => (this.tocOpen = false));

    handleBreakpoint = action(({ matches }: MediaQueryListEvent) => {
        if (matches) {
            this.navigationOpen = false;
            this.tocOpen = false;
        }
    });

    handleNavigationClick = ({ target, defaultPrevented }: MouseEvent<HTMLDialogElement>) => {
        if (!defaultPrevented && target instanceof Element && target.closest('a[href]'))
            this.hideNavigation();
    };

    render() {
        const { headerTarget, navigationOpen, tocOpen } = this;
        const navigationToggle = (
            <Button
                size="sm"
                type="button"
                aria-label="Toggle docs navigation"
                aria-controls="documentation-navigation-drawer"
                aria-expanded={navigationOpen}
                icon
                onClick={this.showNavigation}
            >
                <Icon name="list" aria-hidden="true" />
            </Button>
        );

        return (
            <>
                {headerTarget && createPortal(navigationToggle, headerTarget)}

                <div className="fixed-bottom d-flex justify-content-center mb-5 pe-none lg:d-none z-fixed">
                    <Button
                        type="button"
                        variant="solid"
                        theme="inverse"
                        className="rounded-pill px-5 fs-sm shadow-lg pe-auto"
                        aria-controls="documentation-toc-drawer"
                        aria-expanded={tocOpen}
                        onClick={this.showToc}
                    >
                        <Icon name="list" aria-hidden="true" />
                        On this page…
                    </Button>
                </div>

                <Drawer
                    id="documentation-navigation-drawer"
                    title="Documentation navigation"
                    placement="start"
                    open={navigationOpen}
                    onDismiss={this.hideNavigation}
                    onClick={this.handleNavigationClick}
                >
                    {this.props.children}
                </Drawer>

                <Drawer
                    id="documentation-toc-drawer"
                    title="On this page"
                    placement="end"
                    open={tocOpen}
                    onDismiss={this.hideToc}
                >
                    <DocumentToc onItemClick={this.hideToc} />
                </Drawer>
            </>
        );
    }
}
