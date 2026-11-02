'use client';

import {
    createRef,
    DetailedHTMLProps,
    HTMLAttributes,
    PropsWithChildren,
    PureComponent
} from 'react';

export type ClickBoundaryProps = PropsWithChildren<
    {
        onInnerClick?: (event: MouseEvent) => unknown;
        onOuterClick?: (event: MouseEvent) => unknown;
    } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>;

export class ClickBoundary extends PureComponent<ClickBoundaryProps> {
    root = createRef<HTMLDivElement>();

    switchClick = (event: MouseEvent) => {
        const { onInnerClick, onOuterClick } = this.props;

        if (this.root.current?.contains(event.target as Node)) onInnerClick?.(event);
        else onOuterClick?.(event);
    };

    componentDidMount() {
        window.addEventListener('click', this.switchClick, true);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.switchClick, true);
    }

    render() {
        const { children, onInnerClick: _, onOuterClick: __, ...props } = this.props;

        return (
            <div ref={this.root} {...props}>
                {children}
            </div>
        );
    }
}
