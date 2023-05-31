import { createRef, PropsWithChildren, PureComponent } from 'react';

export type ClickBoundaryProps = PropsWithChildren<{
    className?: string;
    onInnerClick?: (event: MouseEvent) => any;
    onOuterClick?: (event: MouseEvent) => any;
}>;

export class ClickBoundary extends PureComponent<ClickBoundaryProps> {
    root = createRef<HTMLDivElement>();

    switchClick = (event: MouseEvent) => {
        const { onInnerClick, onOuterClick } = this.props;

        if (this.root.current?.contains(event.target as Node))
            onInnerClick?.(event);
        else onOuterClick?.(event);
    };

    componentDidMount() {
        window.addEventListener('click', this.switchClick, true);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.switchClick, true);
    }

    render() {
        const { className, children } = this.props;

        return (
            <div className={className} ref={this.root}>
                {children}
            </div>
        );
    }
}
