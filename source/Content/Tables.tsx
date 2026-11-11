import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';
import type { Breakpoint } from '../Layout/Grid';

export interface TableProps extends ComponentPropsWithRef<'table'> {
    striped?: boolean;
    stripedColumns?: boolean;
    hover?: boolean;
    bordered?: boolean;
    borderless?: boolean;
    card?: boolean;
    small?: boolean;
    responsive?: boolean | Breakpoint;
    stacked?: boolean | Breakpoint;
    verticalAlign?: 'baseline' | 'top' | 'middle' | 'bottom' | 'text-top' | 'text-bottom';
    captionTop?: boolean;
}

export const Table = polymorphic<TableProps>(
    ({
        as: RootAs,
        className,
        children,
        striped,
        stripedColumns,
        hover,
        bordered,
        borderless,
        card,
        small,
        responsive,
        stacked,
        verticalAlign,
        captionTop,
        ...props
    }) => {
        const Root = RootAs ?? 'div';
        const TableRoot = !responsive && RootAs ? RootAs : 'table';
        const hasWrapper = !!responsive || !!card;

        const table = (
            <TableRoot
                {...(responsive && RootAs ? {} : props)}
                className={classNames(
                    'table',
                    {
                        'table-striped': striped,
                        'table-striped-columns': stripedColumns,
                        'table-hover': hover,
                        'table-bordered': bordered,
                        'table-borderless': borderless,
                        'table-sm': small
                    },
                    stacked === true && 'table-stacked',
                    typeof stacked === 'string' && `${stacked}:table-stacked`,
                    verticalAlign && `align-${verticalAlign}`,
                    captionTop && 'caption-top',
                    responsive && RootAs ? undefined : className
                )}
            >
                {children}
            </TableRoot>
        );

        return !hasWrapper ? (
            table
        ) : (
            <Root
                {...(responsive && RootAs ? props : {})}
                className={classNames(
                    responsive && 'table-responsive',
                    responsive && responsive !== true && `${responsive}:table-responsive`,
                    card && 'table-card',
                    responsive && RootAs && className
                )}
            >
                {table}
            </Root>
        );
    }
);
Table.displayName = 'Table';
