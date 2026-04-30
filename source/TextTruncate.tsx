import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, createRef, CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface TextTruncateProps extends HTMLAttributes<HTMLParagraphElement> {
    rows?: number;
    expandText?: ReactNode;
    collapseText?: ReactNode;
}

@observer
export class TextTruncate extends Component<TextTruncateProps> {
    static displayName = 'TextTruncate';

    @observable
    accessor expanded = false;

    @observable
    accessor overflowed = false;

    contentRef = createRef<HTMLSpanElement>();

    componentDidMount() {
        this.checkOverflow();
    }

    componentDidUpdate({ rows, children }: TextTruncateProps) {
        if (!this.expanded && (children !== this.props.children || rows !== this.props.rows))
            this.checkOverflow();
    }

    checkOverflow = () => {
        const { current } = this.contentRef;

        if (current) this.overflowed = current.scrollHeight > current.clientHeight;
    };

    toggle = () => {
        this.expanded = !this.expanded;

        if (!this.expanded) requestAnimationFrame(this.checkOverflow);
    };

    render() {
        const { children, rows = 3, expandText = '⏬', collapseText = '⏫', ...props } = this.props;
        const { expanded, overflowed } = this;
        const style: CSSProperties = {
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: rows
        };
        return (
            <p {...props}>
                <span ref={this.contentRef} style={expanded ? undefined : style}>
                    {children}
                </span>
                {(overflowed || expanded) && (
                    <button className="bg-transparent border-0 p-0" onClick={this.toggle}>
                        {expanded ? collapseText : expandText}
                    </button>
                )}
            </p>
        );
    }
}
