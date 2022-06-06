import classNames from 'classnames';
import React, { ReactNode, PureComponent } from 'react';
import { Table } from 'react-bootstrap';

export interface Column<T> {
    key?: string;
    label: string;
    width?: number;
    render?: (params: T, index?: number) => ReactNode;
}

export interface IdeaTableProps<T> {
    className?: string;
    rowKey?: string | ((params: T) => string | number);
    noneNode?: ReactNode;
    loadingNode?: ReactNode;
    columns: Column<T>[];
    list: T[];
}

export class IdeaTable<T> extends PureComponent<IdeaTableProps<T>> {
    static displayName = 'IdeaTable';

    renderRow = (row: T, index: number) => {
        const { columns = [], rowKey = (params: T) => JSON.stringify(params) } =
            this.props;

        return (
            <tr
                key={typeof rowKey === 'string' ? row[rowKey] : rowKey?.(row)}
                className="text-center"
            >
                {columns.map(({ key, render, width }) => {
                    let value = '';

                    if (key?.includes('.')) {
                        const [first, second] = key.split('.');
                        value = row[first]?.[second];
                    } else {
                        value = row[key];
                    }

                    return (
                        <td className="align-middle" key={key} width={width}>
                            {render?.(row, index) || value || '-'}
                        </td>
                    );
                })}
            </tr>
        );
    };

    render() {
        const {
            list = [],
            columns = [],
            className,
            noneNode = 'No data',
            loadingNode
        } = this.props;

        return (
            <Table
                className={classNames('text-break', className)}
                hover
                responsive
            >
                <thead>
                    <tr className="text-center text-nowrap">
                        {columns.map(({ label }) => (
                            <th key={label}>{label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="border-top">
                    {loadingNode ? (
                        loadingNode
                    ) : list.length > 0 ? (
                        list.map(this.renderRow)
                    ) : (
                        <tr>
                            <td
                                className="p-5"
                                align="center"
                                colSpan={columns.length}
                            >
                                {noneNode}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }
}
