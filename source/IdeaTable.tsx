import classNames from 'classnames';
import React, { ReactNode, PureComponent } from 'react';
import { Table } from 'react-bootstrap';

export interface Base {
    id: number | string;
}

export interface Column<T> {
    key?: string;
    label: string;
    width?: number;
    render?: (params: T, index?: number) => ReactNode;
}

export interface IdeaTableProps<T extends Base> {
    className?: string;
    noneNode?: ReactNode;
    loadingNode?: ReactNode;
    columns: Column<T>[];
    list: T[];
}

export class IdeaTable<T extends Base> extends PureComponent<
    IdeaTableProps<T>
> {
    renderRow = (row: T, index: number) => {
        const { columns = [] } = this.props;

        return (
            <tr key={row?.id} className="text-center">
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
            children,
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
