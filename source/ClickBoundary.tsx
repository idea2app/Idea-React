import { createRef, DetailedHTMLProps, HTMLAttributes, PropsWithChildren, PureComponent } from 'react';

export type ClickBoundaryProps = PropsWithChildren<
    {
        onInnerClick?: (event: MouseEvent) => any;
        onOuterClick?: (event: MouseEvent) => any;
    } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>;

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
        const { children, ...props } = this.props;

        return (
            <div ref={this.root} {...props}>
                {children}
            </div>
        );
    }
}
