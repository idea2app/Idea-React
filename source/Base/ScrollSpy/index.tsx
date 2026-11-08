'use client';

import classNames from 'classnames';
import { observer } from 'mobx-react';
import { Component, ComponentPropsWithRef, createRef, ElementType, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { AsProps, PolymorphicClassProps } from '../../Helper/Polymorphic';
import { ScrollSpyModel } from './model';

export interface ScrollSpyProps extends Omit<
    ComponentPropsWithRef<'div'>,
    'onChange' | 'children'
> {
    children: ReactNode;
    debug?: boolean;
    onActiveChange?: (id: string) => unknown;
    rootMargin?: string | null;
    scrollRoot?: 'self' | 'window';
    smoothScroll?: boolean;
    target?: string;
    threshold?: number[];
    topMargin?: string;
}

interface ScrollSpyEntry {
    id: string;
    link: HTMLAnchorElement;
    section: HTMLElement;
}

@observer
export class ScrollSpy<T extends ElementType | undefined = 'div'> extends Component<
    PolymorphicClassProps<T, ScrollSpyProps>
> {
    declare readonly props: PolymorphicClassProps<T, ScrollSpyProps>;

    protected get componentProps(): Readonly<ScrollSpyProps & AsProps> {
        return this.props;
    }

    static displayName = 'ScrollSpy';

    root = createRef<HTMLDivElement>();

    store = new ScrollSpyModel();

    private entries: ScrollSpyEntry[] = [];

    private observer?: IntersectionObserver;

    private bottomObserver?: IntersectionObserver;

    private intersecting = new Set<Element>();

    private atBottom = false;

    private mounted = false;

    sentinel = createRef<HTMLDivElement>();

    componentDidMount() {
        this.mounted = true;
        this.refresh();

        this.root.current?.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('click', this.handleNavigationClick);
    }

    componentDidUpdate(previous: ScrollSpyProps) {
        if (
            previous.children !== this.componentProps.children ||
            previous.target !== this.componentProps.target ||
            previous.rootMargin !== this.componentProps.rootMargin ||
            previous.topMargin !== this.componentProps.topMargin ||
            previous.threshold !== this.componentProps.threshold ||
            previous.scrollRoot !== this.componentProps.scrollRoot
        )
            this.refresh();

        if (previous.debug !== this.componentProps.debug) this.updateGuides();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.observer?.disconnect();
        this.bottomObserver?.disconnect();

        this.root.current?.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('click', this.handleNavigationClick);
    }

    refresh = () => {
        const root = this.root.current;
        if (!root) return;

        const navigation = this.componentProps.target
            ? document.querySelector<HTMLElement>(this.componentProps.target)
            : root;
        const links = [...(navigation?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]') ?? [])];

        this.entries = links.flatMap(link => {
            const hash = link.getAttribute('href')?.slice(1);
            if (!hash) return [];

            const id = decodeURIComponent(hash);
            const section = document.getElementById(id);

            return !section ||
                section.hidden ||
                section.closest('[hidden]') ||
                section.getAttribute('aria-hidden') === 'true' ||
                getComputedStyle(section).display === 'none' ||
                getComputedStyle(section).visibility === 'hidden'
                ? []
                : [{ id, link, section }];
        });
        this.entries.sort(
            (first, second) =>
                first.section.getBoundingClientRect().top -
                second.section.getBoundingClientRect().top
        );
        this.rebuildObservers();
        this.updateActive();
        this.updateGuides();
    };

    handleResize = () => {
        this.rebuildObservers();
        this.updateGuides();
    };

    handleScroll = () => this.updateGuides();

    private getRootHeight = () =>
        this.componentProps.scrollRoot === 'window'
            ? document.documentElement.clientHeight || window.innerHeight
            : (this.root.current?.clientHeight ?? 0);

    private getRootMargin = () => {
        if (this.componentProps.rootMargin != null) return this.componentProps.rootMargin;
        const { topMargin = '12%' } = this.componentProps;
        const value = Number.parseFloat(topMargin) || 0;
        const height = this.getRootHeight();
        const percent = topMargin.endsWith('%') ? value : height ? (value / height) * 100 : 12;

        return `0px 0px -${Math.min(Math.max(100 - percent, 0), 100)}% 0px`;
    };

    private rebuildObservers = () => {
        this.observer?.disconnect();
        this.bottomObserver?.disconnect();
        this.intersecting.clear();
        this.atBottom = false;

        const root = this.componentProps.scrollRoot === 'window' ? null : this.root.current;
        const observer = new window.IntersectionObserver(
            entries => {
                if (!this.mounted || this.observer !== observer) return;
                for (const entry of entries) {
                    if (entry.isIntersecting) this.intersecting.add(entry.target);
                    else this.intersecting.delete(entry.target);
                }
                this.updateActive();
            },
            {
                root,
                rootMargin: this.getRootMargin(),
                threshold: this.componentProps.threshold ?? [0]
            }
        );
        this.observer = observer;

        for (const section of new Set(this.entries.map(entry => entry.section)))
            observer.observe(section);

        const bottomObserver = new window.IntersectionObserver(
            entries => {
                if (!this.mounted || this.bottomObserver !== bottomObserver) return;

                const scroller = root ?? document.scrollingElement ?? document.documentElement;
                this.atBottom =
                    Boolean(entries.at(-1)?.isIntersecting) &&
                    scroller.scrollHeight > scroller.clientHeight;
                this.updateActive();
                this.updateGuides();
            },
            { root, threshold: [0] }
        );
        this.bottomObserver = bottomObserver;
        if (this.sentinel.current) bottomObserver.observe(this.sentinel.current);
    };

    handleNavigationClick = (event: globalThis.MouseEvent) => {
        if (!this.componentProps.smoothScroll || event.defaultPrevented) return;

        const link =
            event.target instanceof Element
                ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
                : null;
        const entry = this.entries.find(candidate => candidate.link === link);
        if (!link || !entry) return;

        event.preventDefault();
        const root = this.root.current;
        const { scrollRoot = 'self' } = this.componentProps;
        if (scrollRoot === 'window')
            window.scrollTo({
                top: window.scrollY + entry.section.getBoundingClientRect().top,
                behavior: 'smooth'
            });
        else if (root) {
            const top =
                root.scrollTop +
                entry.section.getBoundingClientRect().top -
                root.getBoundingClientRect().top;

            root.scrollTo({ top, behavior: 'smooth' });
        }
        window.history.replaceState(null, '', `#${encodeURIComponent(entry.id)}`);

        const temporaryTabIndex = !entry.section.hasAttribute('tabindex');
        if (temporaryTabIndex) entry.section.tabIndex = -1;

        entry.section.focus({ preventScroll: true });

        if (temporaryTabIndex) entry.section.removeAttribute('tabindex');
        this.updateActive();
    };

    private getActivationLine = (rootHeight: number) => {
        const margins = this.getRootMargin().trim().split(/\s+/);
        const bottom = margins[2] ?? margins[0];
        const parsed = Number.parseFloat(bottom) || 0;

        return rootHeight + (bottom.endsWith('%') ? (rootHeight * parsed) / 100 : parsed);
    };

    private updateGuides = () => {
        const root = this.root.current;
        if (!this.componentProps.debug || !root) return this.store.setGuides(undefined);

        const rect = root.getBoundingClientRect();
        const height = this.getRootHeight();

        this.store.setGuides({
            top: this.componentProps.scrollRoot === 'window' ? 0 : rect.top,
            left: this.componentProps.scrollRoot === 'window' ? 0 : rect.left,
            width:
                this.componentProps.scrollRoot === 'window' ? window.innerWidth : root.clientWidth,
            height,
            line: this.getActivationLine(height),
            atBottom: this.atBottom
        });
    };

    private updateActive = () => {
        const root = this.root.current;
        if (!root || !this.entries.length) return;

        const lastEntry = this.entries.at(-1);
        const current =
            (this.atBottom ? lastEntry : undefined) ??
            [...this.entries].reverse().find(({ section }) => this.intersecting.has(section)) ??
            this.entries.find(entry => entry.id === this.store.activeId) ??
            this.entries[0];
        const activeLinks = new Set(
            this.entries.filter(entry => entry.id === current.id).map(entry => entry.link)
        );
        let nestedNav = current.link.closest('.nav');
        let parentNav = nestedNav?.parentElement?.closest('.nav');

        while (parentNav && parentNav !== this.root.current) {
            const parentEntry = [...this.entries]
                .reverse()
                .find(
                    entry =>
                        entry.link.closest('.nav') === parentNav &&
                        Boolean(
                            entry.section.compareDocumentPosition(current.section) &
                            Node.DOCUMENT_POSITION_FOLLOWING
                        )
                );
            if (parentEntry) activeLinks.add(parentEntry.link);
            nestedNav = parentNav;
            parentNav = nestedNav.parentElement?.closest('.nav');
        }

        for (const { link } of this.entries) {
            const active = activeLinks.has(link);

            link.classList.toggle('active', active);

            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        }
        if (current.id === this.store.activeId) return;

        this.store.setActiveId(current.id);
        this.componentProps.onActiveChange?.(current.id);
    };

    renderDebug = () => {
        const guides = this.store.guides;
        if (!this.componentProps.debug || !guides) return null;

        const { top, left, width, height, line, atBottom } = guides;

        return createPortal(
            <div
                className="position-fixed overflow-hidden pe-none"
                style={{ top, left, width, height, zIndex: 1080 }}
                aria-hidden="true"
                data-scrollspy-debug
            >
                <div
                    className="position-absolute start-0 end-0 border-top border-danger border-2"
                    style={{ top: line, borderTopStyle: 'dashed' }}
                    data-scrollspy-line
                />
                <div
                    className="position-absolute bottom-0 start-0 end-0 border-top border-danger"
                    style={{
                        height: 12,
                        borderTop: '1px solid #dc3545',
                        background: atBottom ? 'rgb(220 53 69 / 40%)' : 'rgb(220 53 69 / 10%)'
                    }}
                    data-scrollspy-bottom={atBottom ? 'reached' : 'pending'}
                />
            </div>,
            document.body
        );
    };

    render() {
        const Root: ElementType = this.componentProps.as ?? 'div';

        const {
            as: _as,
            children,
            className,
            debug: _debug,
            onActiveChange: _onActiveChange,
            onClick: _onClick,
            onKeyDown: _onKeyDown,
            rootMargin: _rootMargin,
            scrollRoot: _scrollRoot,
            smoothScroll: _smoothScroll,
            target: _target,
            threshold: _threshold,
            topMargin: _topMargin,
            ...props
        } = this.componentProps;

        return (
            <Root
                {...props}
                ref={this.root}
                className={classNames('scrollspy', className)}
                data-active-id={this.store.activeId || undefined}
                data-bs-root-margin={this.componentProps.rootMargin ?? undefined}
                tabIndex={this.componentProps.tabIndex ?? 0}
                onClick={this.componentProps.onClick}
                onKeyDown={this.componentProps.onKeyDown}
            >
                {children}
                <div
                    ref={this.sentinel}
                    className="position-relative invisible m-0 border-0 p-0 w-0 h-0"
                    aria-hidden="true"
                />
                {this.renderDebug()}
            </Root>
        );
    }
}
