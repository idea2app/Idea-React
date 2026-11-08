'use client';

import classNames from 'classnames';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ElementType } from 'react';
import { scrollTo, uniqueID } from 'web-utility';

import { Nav, NavLink, NavProps } from '../Base/Nav';
import { AsProps, PolymorphicClassProps } from '../Helper/Polymorphic';

const HeadingSelector = Array.from({ length: 6 }, (_, index) => `h${index + 1}`).join(',');

type HeadingMeta = Record<'id' | 'text', string> & Record<'level' | 'top', number>;

export interface PageNavProps extends Omit<NavProps, 'ref'> {
    depth?: number;
    minDepth?: number;
    rootSelector?: string;
    onItemClick?: (item: HeadingMeta) => void;
}

@observer
export class PageNav<T extends ElementType | undefined = 'nav'> extends Component<
    PolymorphicClassProps<T, PageNavProps>
> {
    declare readonly props: PolymorphicClassProps<T, PageNavProps>;

    protected get componentProps(): Readonly<PageNavProps & AsProps> {
        return this.props;
    }

    static displayName = 'PageNav';

    @observable
    accessor list: HeadingMeta[] = [];

    @observable
    accessor scrollY = 0;

    @computed
    get currentActiveId() {
        const { list, scrollY } = this;
        const index = list.findIndex(({ top }) => top > scrollY);

        return list[index < 0 ? list.length - 1 : index - 1]?.id;
    }

    updateScrollY = action(() => {
        this.scrollY = window.scrollY;

        this.list = this.list.map(item => {
            const element = document.getElementById(item.id);

            return element
                ? { ...item, top: element.getBoundingClientRect().top + this.scrollY }
                : item;
        });
    });

    componentDidMount() {
        if (!globalThis.document) return;

        window.addEventListener('scroll', this.updateScrollY);
        window.addEventListener('resize', this.updateScrollY);

        this.initList();
        this.updateScrollY();
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
        const { rootSelector } = this.componentProps;
        const root = rootSelector ? document.querySelector(rootSelector) : document;

        if (!root) return;

        this.list = Array.from(
            root.querySelectorAll<HTMLHeadingElement>(HeadingSelector),
            element => {
                const text = element.textContent.trim();

                element.id ||= PageNav.slugOf(text);

                const { id, tagName } = element;
                const top = element.getBoundingClientRect().top + window.scrollY;

                return { id, level: +tagName[1], text, top };
            }
        );
    }

    componentWillUnmount(): void {
        window.removeEventListener('scroll', this.updateScrollY);
        window.removeEventListener('resize', this.updateScrollY);
    }

    scrollTo = (meta: HeadingMeta) => () => {
        setTimeout(() => scrollTo(`[id="${meta.id}"]`));

        this.componentProps.onItemClick?.(meta);
    };

    renderLink = ({ id, level, text, top }: HeadingMeta) => {
        const { currentActiveId } = this,
            { depth = Infinity, minDepth = 1 } = this.componentProps;

        return (
            minDepth <= level &&
            level <= depth && (
                <NavLink
                    key={id}
                    className={classNames(
                        'justify-content-start text-wrap min-w-0',
                        currentActiveId === id && 'active'
                    )}
                    style={{ paddingInlineStart: `${level - minDepth + 0.75}rem` }}
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
            } = this.componentProps;

        return (
            <Nav as={this.componentProps.as} {...props} variant="underline" vertical>
                {list.map(this.renderLink)}
            </Nav>
        );
    }
}
