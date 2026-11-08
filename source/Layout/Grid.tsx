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
    xs?: BreakpointColSize;
    sm?: BreakpointColSize;
    md?: BreakpointColSize;
    lg?: BreakpointColSize;
    xl?: BreakpointColSize;
    '2xl'?: BreakpointColSize;
}

export const Col = polymorphic<ColProps>(
    ({ as: Root = 'div', xs, sm, md, lg, xl, '2xl': xxl, className, ...props }) => {
        const sizes: [Breakpoint, BreakpointColSize | undefined][] = [
            ['sm', sm],
            ['md', md],
            ['lg', lg],
            ['xl', xl],
            ['2xl', xxl]
        ];
        const sized = sizes.some(([, size]) => size !== undefined);

        return (
            <Root
                {...props}
                className={classNames(
                    {
                        col: (xs === undefined && !sized) || xs === true,
                        [`col-${xs}`]: xs !== undefined && xs !== true
                    },
                    sizes.map(
                        ([breakpoint, size]) =>
                            size !== undefined &&
                            (size === true ? `${breakpoint}:col` : `${breakpoint}:col-${size}`)
                    ),
                    className
                )}
            />
        );
    }
);
Col.displayName = 'Col';
