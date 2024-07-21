import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Nav, NavProps } from 'react-bootstrap';
import { scrollTo, uniqueID } from 'web-utility';

const HeadingSelector =
    Array.from(new Array(6), (_, index) => `h${++index}`) + '';

type HeadingMeta = Record<'id' | 'text', string> &
    Record<'level' | 'top', number>;

export interface PageNavProps extends NavProps {
    depth?: number;
    onItemClick?: (item: HeadingMeta) => any;
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
                <Nav.Item key={id} style={{ textIndent: `${level - 1}rem` }}>
                    <Nav.Link
                        href={`#${id}`}
                        active={currentActiveId === id}
                        onClick={this.scrollTo({ id, level, text, top })}
                    >
                        {text}
                    </Nav.Link>
                </Nav.Item>
            )
        );
    };

    render() {
        const { list } = this,
            { style, variant = 'underline', ...props } = this.props;

        return (
            <Nav
                {...{ ...props, variant }}
                style={{ flexDirection: 'column', ...style }}
            >
                {list.map(this.renderLink)}
            </Nav>
        );
    }
}
