import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, HTMLAttributes } from 'react';
import { scrollTo, uniqueID } from 'web-utility';

const HeadingSelector = Array.from({ length: 6 }, (_, index) => `h${index + 1}`).join(',');

type HeadingMeta = Record<'id' | 'text', string> & Record<'level' | 'top', number>;

export interface PageNavProps extends HTMLAttributes<HTMLElement> {
    depth?: number;
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

    updateScrollY = () => (this.scrollY = window.scrollY);

    componentDidMount() {
        if (!globalThis.document) return;

        window.addEventListener('scroll', this.updateScrollY);

        this.list = Array.from(
            document.querySelectorAll<HTMLHeadingElement>(HeadingSelector),
            element => {
                element.id ||= uniqueID();

                const { id, tagName, textContent, offsetTop } = element;

                return {
                    id,
                    level: +tagName[1],
                    text: textContent.trim(),
                    top: offsetTop
                };
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
            { depth = Infinity } = this.props;

        return (
            level <= depth && (
                <a
                    key={id}
                    className={`nav-link${currentActiveId === id ? ' active' : ''}`}
                    href={`#${id}`}
                    aria-current={currentActiveId === id ? 'location' : undefined}
                    style={{ textIndent: `${level - 1}rem` }}
                    onClick={this.scrollTo({ id, level, text, top })}
                >
                    {text}
                </a>
            )
        );
    };

    render() {
        const { list } = this,
            {
                className = '',
                depth: _depth,
                onItemClick: _onItemClick,
                style,
                ...props
            } = this.props;

        return (
            <nav {...props} className={`nav nav-underline flex-column ${className}`} style={style}>
                {list.map(this.renderLink)}
            </nav>
        );
    }
}
