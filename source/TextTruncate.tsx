import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, createRef, HTMLAttributes } from 'react';
import { Button } from 'react-bootstrap';

export interface TextTruncateProps extends HTMLAttributes<HTMLDivElement> {
    lines?: number;
    expandText?: string;
    collapseText?: string;
}

@observer
export class TextTruncate extends Component<TextTruncateProps> {
    static displayName = 'TextTruncate';

    @observable
    accessor expanded = false;

    @observable
    accessor overflowed = false;

    contentRef = createRef<HTMLDivElement>();

    componentDidMount() {
        this.checkOverflow();
    }

    componentDidUpdate(prevProps: TextTruncateProps) {
        if (
            !this.expanded &&
            (prevProps.children !== this.props.children || prevProps.lines !== this.props.lines)
        ) {
            this.checkOverflow();
        }
    }

    checkOverflow = () => {
        const { current } = this.contentRef;

        if (current) {
            this.overflowed = current.scrollHeight > current.clientHeight;
        }
    };

    toggle = () => {
        this.expanded = !this.expanded;

        if (!this.expanded) {
            requestAnimationFrame(this.checkOverflow);
        }
    };

    render() {
        const {
            className,
            children,
            lines = 3,
            expandText = '展开',
            collapseText = '收起',
            ...props
        } = this.props;
        const { expanded, overflowed } = this;

        return (
            <div className={classNames(className)} {...props}>
                <div
                    ref={this.contentRef}
                    style={
                        expanded
                            ? undefined
                            : {
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: lines
                              }
                    }
                >
                    {children}
                </div>
                {(overflowed || expanded) && (
                    <Button variant="link" className="p-0" onClick={this.toggle}>
                        {expanded ? collapseText : expandText}
                    </Button>
                )}
            </div>
        );
    }
}
