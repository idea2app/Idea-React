import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import type { Breakpoint } from './Grid';

export interface TableProps extends ComponentPropsWithRef<'table'> {
    striped?: boolean;
    stripedColumns?: boolean;
    hover?: boolean;
    bordered?: boolean;
    borderless?: boolean;
    small?: boolean;
    responsive?: boolean | Breakpoint;
}

export const Table: FC<TableProps> = ({
    striped,
    stripedColumns,
    hover,
    bordered,
    borderless,
    small,
    responsive,
    className,
    ...props
}) => {
    const table = (
        <table
            {...props}
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
                className
            )}
        />
    );

    if (!responsive) return table;

    return (
        <div
            className={classNames(
                'table-responsive',
                responsive !== true && `${responsive}:table-responsive`
            )}
        >
            {table}
        </div>
    );
};

Table.displayName = 'Table';
