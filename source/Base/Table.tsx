import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import type { Breakpoint } from './Grid';
import { polymorphic } from './Polymorphic';

export interface TableProps extends ComponentPropsWithRef<'table'> {
    striped?: boolean;
    stripedColumns?: boolean;
    hover?: boolean;
    bordered?: boolean;
    borderless?: boolean;
    small?: boolean;
    responsive?: boolean | Breakpoint;
}

export const Table = polymorphic<TableProps>(
    ({
        as: RootAs,
        striped,
        stripedColumns,
        hover,
        bordered,
        borderless,
        small,
        responsive,
        className,
        children,
        ...props
    }) => {
        const Root = RootAs ?? 'div';
        const TableRoot = !responsive && RootAs ? RootAs : 'table';

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
                    responsive && RootAs ? undefined : className
                )}
            >
                {children}
            </TableRoot>
        );

        return !responsive ? (
            table
        ) : (
            <Root
                {...(RootAs ? props : {})}
                className={classNames(
                    'table-responsive',
                    responsive !== true && `${responsive}:table-responsive`,
                    RootAs && className
                )}
            >
                {table}
            </Root>
        );
    }
);
Table.displayName = 'Table';
