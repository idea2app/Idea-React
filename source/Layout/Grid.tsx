import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ColSize = number | 'auto';
export type BreakpointColSize = ColSize | true;

export interface ContainerProps extends ComponentPropsWithRef<'div'> {
    fluid?: boolean | Breakpoint;
}

export const Container = polymorphic<ContainerProps>(
    ({ as: Root = 'div', fluid, className, ...props }) => (
        <Root
            {...props}
            className={classNames(
                fluid === true ? 'container-fluid' : fluid ? `${fluid}:container` : 'container',
                className
            )}
        />
    )
);
Container.displayName = 'Container';

export type RowCols = number | 'auto';

export interface RowProps extends ComponentPropsWithRef<'div'> {
    xs?: RowCols;
    sm?: RowCols;
    md?: RowCols;
    lg?: RowCols;
    xl?: RowCols;
    '2xl'?: RowCols;
}

export const Row = polymorphic<RowProps>(
    ({ as: Root = 'div', xs, sm, md, lg, xl, '2xl': xxl, className, ...props }) => {
        const sizes: [Breakpoint, RowCols | undefined][] = [
            ['sm', sm],
            ['md', md],
            ['lg', lg],
            ['xl', xl],
            ['2xl', xxl]
        ];

        return (
            <Root
                {...props}
                className={classNames(
                    'row',
                    xs !== undefined && `row-cols-${xs}`,
                    sizes.map(
                        ([breakpoint, size]) =>
                            size !== undefined && `${breakpoint}:row-cols-${size}`
                    ),
                    className
                )}
            />
        );
    }
);
Row.displayName = 'Row';

export interface ColProps extends ComponentPropsWithRef<'div'> {
    xs?: ColBreakpoint;
    sm?: ColBreakpoint;
    md?: ColBreakpoint;
    lg?: ColBreakpoint;
    xl?: ColBreakpoint;
    '2xl'?: ColBreakpoint;
}

export type ColOrder = number | 'first' | 'last';

export interface ColBreakpointOptions {
    span?: BreakpointColSize;
    offset?: number;
    order?: ColOrder;
}

export type ColBreakpoint = BreakpointColSize | ColBreakpointOptions;

export const Col = polymorphic<ColProps>(
    ({ as: Root = 'div', xs, sm, md, lg, xl, '2xl': xxl, className, ...props }) => {
        const sizes: [Breakpoint | undefined, ColBreakpoint | undefined][] = [
            [undefined, xs],
            ['sm', sm],
            ['md', md],
            ['lg', lg],
            ['xl', xl],
            ['2xl', xxl]
        ];
        const hasSpan = sizes.some(([, options]) =>
            typeof options === 'object' ? options.span !== undefined : options !== undefined
        );
        const classes = sizes.map(([breakpoint, options]) => {
            if (options === undefined) return [];

            const prefix = breakpoint ? `${breakpoint}:` : '';
            const { span, offset, order } =
                typeof options === 'object' ? options : { span: options };

            return [
                span !== undefined && `${prefix}col${span === true ? '' : `-${span}`}`,
                offset !== undefined && `${prefix}offset-${offset}`,
                order !== undefined && `${prefix}order-${order}`
            ];
        });

        return <Root {...props} className={classNames(!hasSpan && 'col', classes, className)} />;
    }
);
Col.displayName = 'Col';
