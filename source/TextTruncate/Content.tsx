'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, createRef, CSSProperties, ReactNode } from 'react';

export interface TextTruncateContentProps {
    rows: number;
    expandText: ReactNode;
    collapseText: ReactNode;
    children: ReactNode;
}

@observer
export class TextTruncateContent extends Component<TextTruncateContentProps> {
    @observable
    accessor expanded = false;

    @observable
    accessor overflowed = false;

    contentRef = createRef<HTMLDivElement>();

    componentDidMount() {
        this.checkOverflow();
        window.addEventListener('resize', this.checkOverflow);
    }

    componentDidUpdate({ rows, children }: TextTruncateContentProps) {
        if (!this.expanded && (children !== this.props.children || rows !== this.props.rows))
            this.checkOverflow();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkOverflow);
    }

    @action
    checkOverflow = () => {
        const { current } = this.contentRef;

        if (current) this.overflowed = current.scrollHeight > current.clientHeight;
    };

    @action
    toggle = () => {
        this.expanded = !this.expanded;

        if (!this.expanded) requestAnimationFrame(this.checkOverflow);
    };

    render() {
        const { children, rows, expandText, collapseText } = this.props;
        const { expanded, overflowed } = this;
        const clamp: CSSProperties = {
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: rows
        };

        return (
            <>
                <div ref={this.contentRef} style={expanded ? undefined : clamp}>
                    {children}
                </div>
                {(overflowed || expanded) && (
                    <button
                        type="button"
                        className="bg-transparent border-0 p-0"
                        aria-expanded={expanded}
                        onClick={this.toggle}
                    >
                        {expanded ? collapseText : expandText}
                    </button>
                )}
            </>
        );
    }
}
