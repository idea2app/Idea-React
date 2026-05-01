import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, createRef } from 'react';
import { Nav, NavProps } from 'react-bootstrap';

import * as style from './index.module.less';

export type ScrollNavProps = NavProps;

/**
 * A horizontal scrolling navigation bar based on Bootstrap's `nav-scroller` pattern.
 * Automatically shows scroll arrow buttons when nav items overflow the container width.
 *
 * @see {@link https://github.com/twbs/bootstrap/blob/main/site/src/assets/examples/offcanvas-navbar/index.astro#L50-L65}
 */
@observer
export class ScrollNav extends Component<ScrollNavProps> {
    static displayName = 'ScrollNav';

    scrollerRef = createRef<HTMLDivElement>();

    @observable
    accessor scrollLeft = 0;

    @observable
    accessor scrollWidth = 0;

    @observable
    accessor clientWidth = 0;

    @computed
    get canScrollLeft() {
        return this.scrollLeft > 0;
    }

    @computed
    get canScrollRight() {
        return this.scrollLeft + this.clientWidth < this.scrollWidth;
    }

    updateScroll = () => {
        const el = this.scrollerRef.current;
        if (!el) return;

        this.scrollLeft = el.scrollLeft;
        this.scrollWidth = el.scrollWidth;
        this.clientWidth = el.clientWidth;
    };

    resizeTimer: ReturnType<typeof setTimeout> | undefined;

    handleResize = () => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(this.updateScroll, 100);
    };

    componentDidMount() {
        if (!globalThis.document) return;

        const el = this.scrollerRef.current;
        if (!el) return;

        this.updateScroll();
        el.addEventListener('scroll', this.updateScroll);
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        clearTimeout(this.resizeTimer);
        const el = this.scrollerRef.current;
        el?.removeEventListener('scroll', this.updateScroll);
        globalThis.window?.removeEventListener('resize', this.handleResize);
    }

    scrollBy = (direction: -1 | 1) => () => {
        const el = this.scrollerRef.current;
        if (!el) return;

        el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
    };

    render() {
        const { canScrollLeft, canScrollRight } = this;
        const { className = '', children, ...props } = this.props;

        return (
            <div className={`position-relative ${style.navScroller} ${className}`}>
                {canScrollLeft && (
                    <button
                        type="button"
                        className={`${style.scrollButton} ${style.scrollButtonLeft}`}
                        aria-label="Scroll left"
                        onClick={this.scrollBy(-1)}
                    >
                        ‹
                    </button>
                )}
                <div ref={this.scrollerRef} className={style.scrollerInner}>
                    <Nav {...props} className="flex-nowrap">
                        {children}
                    </Nav>
                </div>
                {canScrollRight && (
                    <button
                        type="button"
                        className={`${style.scrollButton} ${style.scrollButtonRight}`}
                        aria-label="Scroll right"
                        onClick={this.scrollBy(1)}
                    >
                        ›
                    </button>
                )}
            </div>
        );
    }
}
