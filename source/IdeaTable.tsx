import React, { PureComponent, ReactNode } from 'react';
import Table from 'react-bootstrap/Table';

export interface Column<T> {
    label: string;
    key?: string;
    render?: (params: T, index?: number) => ReactNode;
    width?: number;
}

export interface IdeaTableProps<T> {
    list: T[];
    columns: Column<T>[];
}

export default class IdeaTable<T> extends PureComponent<
    IdeaTableProps<T>
> {
    renderRow = (row: T, index: number) => {
        const { columns = [] } = this.props;

        return (
            // @ts-ignore
            <tr key={row?.objectId} className="text-center">
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
        const { list = [], columns = [] } = this.props;

        return (
            <Table
                className="small border-left border-right border-bottom"
                hover
                responsive
                style={{ wordBreak: 'break-all' }}
            >
                <thead>
                    <tr className="text-center text-nowrap">
                        {columns.map(({ label }) => (
                            <th key={label}>{label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {list.length > 0 ? (
                        list.map(this.renderRow)
                    ) : (
                        <tr>
                            <td
                                colSpan={20}
                                rowSpan={23}
                                align="center"
                                className="p-5"
                            >{`暂无数据 -(>﹏<)， 请添加数据噢`}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }
}
