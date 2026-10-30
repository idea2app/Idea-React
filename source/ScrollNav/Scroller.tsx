'use client';

import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, createRef, ReactNode } from 'react';

import { Icon } from '../Icon';
import * as style from './index.module.less';

export interface ScrollNavScrollerProps {
    className?: string;
    children: ReactNode;
}

@observer
export class ScrollNavScroller extends Component<ScrollNavScrollerProps> {
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

    @action
    updateScroll = () => {
        const scroller = this.scrollerRef.current;
        if (scroller) {
            this.scrollLeft = scroller.scrollLeft;
            this.scrollWidth = scroller.scrollWidth;
            this.clientWidth = scroller.clientWidth;
        }
        return scroller;
    };

    private resizeObserver?: ResizeObserver;

    componentDidMount() {
        const scroller = this.updateScroll();
        if (!scroller) return;

        scroller.addEventListener('scroll', this.updateScroll);
        this.resizeObserver = new ResizeObserver(this.updateScroll);
        this.resizeObserver.observe(scroller);
    }

    componentWillUnmount() {
        this.resizeObserver?.disconnect();
        this.scrollerRef.current?.removeEventListener('scroll', this.updateScroll);
    }

    scrollBy = (direction: -1 | 1) => {
        const scroller = this.scrollerRef.current;
        if (!scroller) return;

        scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: 'smooth' });
    };

    scrollBackward = () => this.scrollBy(-1);

    scrollForward = () => this.scrollBy(1);

    render() {
        const { canScrollLeft, canScrollRight } = this;
        const { className = '', children } = this.props;

        return (
            <div className={`position-relative overflow-y-hidden ${className}`}>
                {canScrollLeft && (
                    <button
                        type="button"
                        className={`position-absolute top-0 bottom-0 start-0 z-1 border-0 px-2 ${style.scrollButtonLeft}`}
                        aria-label="Scroll left"
                        onClick={this.scrollBackward}
                    >
                        <Icon name="caret-left-fill" />
                    </button>
                )}
                <div ref={this.scrollerRef} className={`overflow-x-auto ${style.scrollerInner}`}>
                    {children}
                </div>
                {canScrollRight && (
                    <button
                        type="button"
                        className={`position-absolute top-0 bottom-0 end-0 z-1 border-0 px-2 ${style.scrollButtonRight}`}
                        aria-label="Scroll right"
                        onClick={this.scrollForward}
                    >
                        <Icon name="caret-right-fill" />
                    </button>
                )}
            </div>
        );
    }
}
