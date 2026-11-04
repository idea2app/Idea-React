'use client';

import {
    createRef,
    DetailedHTMLProps,
    ElementType,
    HTMLAttributes,
    PropsWithChildren,
    PureComponent
} from 'react';

import { AsProps, PolymorphicClassProps } from '../Polymorphic';

export type ClickBoundaryProps = PropsWithChildren<
    {
        onInnerClick?: (event: MouseEvent) => unknown;
        onOuterClick?: (event: MouseEvent) => unknown;
    } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>;

export class ClickBoundary<T extends ElementType | undefined = 'div'> extends PureComponent<
    PolymorphicClassProps<T, ClickBoundaryProps>
> {
    declare readonly props: PolymorphicClassProps<T, ClickBoundaryProps>;

    protected get componentProps(): Readonly<ClickBoundaryProps & AsProps> {
        return this.props;
    }

    root = createRef<HTMLDivElement>();

    switchClick = (event: MouseEvent) => {
        const { onInnerClick, onOuterClick } = this.componentProps;

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
        const Root: ElementType = this.componentProps.as ?? 'div';

        const {
            as: _as,
            children,
            onInnerClick: _,
            onOuterClick: __,
            ...props
        } = this.componentProps;

        return (
            <Root ref={this.root} {...props}>
                {children}
            </Root>
        );
    }
}
