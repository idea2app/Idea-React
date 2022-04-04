import classNames from 'classnames';
import React, { PureComponent, ReactNode } from 'react';
import Table from 'react-bootstrap/Table';

export interface Base {
    id: number | string;
}
export interface Column<T> {
    label: string;
    key?: string;
    render?: (params: T, index?: number) => ReactNode;
    width?: number;
}

export interface IdeaTableProps<T extends Base> {
    list: T[];
    columns: Column<T>[];
    className?: string;
    noneNode?: ReactNode;
    loadingNode?: ReactNode;
}

export default class IdeaTable<T extends Base> extends PureComponent<
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
            noneNode = '暂无数据',
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
                                colSpan={columns.length}
                                align="center"
                                className="p-5"
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
