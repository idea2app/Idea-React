'use client';

import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { scrollTo, uniqueID } from 'web-utility';

import { Nav, NavLink, NavProps } from './Nav';

const HeadingSelector = Array.from({ length: 6 }, (_, index) => `h${index + 1}`).join(',');

type HeadingMeta = Record<'id' | 'text', string> & Record<'level' | 'top', number>;

export interface PageNavProps extends NavProps {
    depth?: number;
    minDepth?: number;
    rootSelector?: string;
    onItemClick?: (item: HeadingMeta) => void;
}

@observer
export class PageNav extends Component<PageNavProps> {
    static displayName = 'PageNav';

    @observable
    accessor list: HeadingMeta[] = [];

    @observable
    accessor scrollY = 0;

    @computed
    get currentActiveId() {
        const { list, scrollY } = this;
        const index = list.findIndex(({ top }) => top > scrollY);

        return list[index - 1]?.id;
    }

    updateScrollY = action(() => (this.scrollY = window.scrollY));

    componentDidMount() {
        if (!globalThis.document) return;

        window.addEventListener('scroll', this.updateScrollY);

        this.initList();
    }

    static slugOf(text: string) {
        const slug = text
            .toLowerCase()
            .replace(/\W+/g, '-')
            .replace(/^-+|-+$/g, '');

        return !slug || document.getElementById(slug) ? uniqueID() : slug;
    }

    @action
    initList() {
        const { rootSelector } = this.props;
        const root = rootSelector ? document.querySelector(rootSelector) : document;

        if (!root) return;

        this.list = Array.from(
            root.querySelectorAll<HTMLHeadingElement>(HeadingSelector),
            element => {
                const text = element.textContent.trim();

                element.id ||= PageNav.slugOf(text);

                const { id, tagName, offsetTop } = element;

                return { id, level: +tagName[1], text, top: offsetTop };
            }
        );
    }

    componentWillUnmount(): void {
        globalThis.removeEventListener?.('scroll', this.updateScrollY);
    }

    scrollTo = (meta: HeadingMeta) => () => {
        setTimeout(() => scrollTo(`[id="${meta.id}"]`));

        this.props.onItemClick?.(meta);
    };

    renderLink = ({ id, level, text, top }: HeadingMeta) => {
        const { currentActiveId } = this,
            { depth = Infinity, minDepth = 1 } = this.props;

        return (
            minDepth <= level &&
            level <= depth && (
                <NavLink
                    key={id}
                    className={currentActiveId === id ? ' active' : ''}
                    style={{ textIndent: `${level - minDepth}rem` }}
                    href={`#${id}`}
                    aria-current={currentActiveId === id ? 'location' : undefined}
                    onClick={this.scrollTo({ id, level, text, top })}
                >
                    {text}
                </NavLink>
            )
        );
    };

    render() {
        const { list } = this,
            {
                depth: _depth,
                minDepth: _minDepth,
                rootSelector: _rootSelector,
                onItemClick: _onItemClick,
                ...props
            } = this.props;

        return (
            <Nav {...props} variant="underline" vertical>
                {list.map(this.renderLink)}
            </Nav>
        );
    }
}
