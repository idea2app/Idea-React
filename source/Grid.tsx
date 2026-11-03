import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from './Polymorphic';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ColSize = number | 'auto';
export type BreakpointColSize = ColSize | true;

export interface ContainerProps extends ComponentPropsWithRef<'div'> {
    fluid?: boolean;
    breakpoint?: Breakpoint;
}

export const Container = polymorphic<ContainerProps>(
    ({ as: Root = 'div', fluid, breakpoint, className, ...props }) => (
        <Root
            {...props}
            className={classNames(
                breakpoint ? `${breakpoint}:container` : fluid ? 'container-fluid' : 'container',
                className
            )}
        />
    )
);

export type RowCols = number | 'auto';

export interface RowProps extends ComponentPropsWithRef<'div'> {
    cols?: RowCols;
    sm?: RowCols;
    md?: RowCols;
    lg?: RowCols;
    xl?: RowCols;
    '2xl'?: RowCols;
}

export const Row = polymorphic<RowProps>(
    ({ as: Root = 'div', cols, sm, md, lg, xl, '2xl': xxl, className, ...props }) => {
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
                    cols !== undefined && `row-cols-${cols}`,
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

export interface ColProps extends ComponentPropsWithRef<'div'> {
    span?: ColSize;
    sm?: BreakpointColSize;
    md?: BreakpointColSize;
    lg?: BreakpointColSize;
    xl?: BreakpointColSize;
    '2xl'?: BreakpointColSize;
}

export const Col = polymorphic<ColProps>(
    ({ as: Root = 'div', span, sm, md, lg, xl, '2xl': xxl, className, ...props }) => {
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
                    !span && !sized && 'col',
                    span !== undefined && `col-${span}`,
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

Container.displayName = 'Container';
Row.displayName = 'Row';
Col.displayName = 'Col';
