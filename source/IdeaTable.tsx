import classNames from 'classnames';
import { ReactNode, PureComponent } from 'react';
import { TableProps, Table } from 'react-bootstrap';

export interface Column<T> {
    key?: string;
    label: ReactNode | ((column: Column<T>) => ReactNode);
    summary?: ReactNode | ((column: Column<T>) => ReactNode);
    width?: number;
    render?: (params: T, index?: number) => ReactNode;
}

export interface IdeaTableProps<T> extends TableProps {
    rowKey?: keyof T | ((params: T) => string | number);
    noneNode?: ReactNode;
    loadingNode?: ReactNode;
    columns: Column<T>[];
    list: T[];
}

export class IdeaTable<T extends Record<string, any>> extends PureComponent<
    IdeaTableProps<T>
> {
    static displayName = 'IdeaTable';

    rowKeyOf(row: T) {
        const { rowKey = (params: T) => JSON.stringify(params) } = this.props;

        return typeof rowKey !== 'function' ? row[rowKey] : rowKey(row);
    }

    renderRow = (row: T, index: number) => {
        const { columns = [] } = this.props;

        return (
            <tr key={this.rowKeyOf(row)} className="text-center">
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

    renderEdge(field: 'label' | 'summary') {
        const { columns = [] } = this.props;

        const Root = field === 'label' ? 'thead' : 'tfoot',
            Cell = field === 'label' ? 'th' : 'td';

        return (
            <Root>
                <tr className="text-center text-nowrap">
                    {columns.map(
                        ({ key, [field]: content, ...column }, index) => {
                            content =
                                typeof content !== 'function'
                                    ? content
                                    : content({
                                          [field]: content,
                                          ...column
                                      } as Column<T>);

                            return (
                                <Cell key={key || `${field}-${index}`}>
                                    {content}
                                </Cell>
                            );
                        }
                    )}
                </tr>
            </Root>
        );
    }

    render() {
        const {
            list = [],
            columns = [],
            className,
            noneNode = 'No data',
            loadingNode,
            hover = true,
            responsive = true,
            ...rest
        } = this.props;

        const hasFooter = columns.some(({ summary }) => summary);

        return (
            <Table
                className={classNames('text-break', className)}
                {...{ hover, responsive, ...rest }}
            >
                {this.renderEdge('label')}

                <tbody className="border-top">
                    {loadingNode ? (
                        loadingNode
                    ) : list.length > 0 ? (
                        list.map(this.renderRow)
                    ) : (
                        <tr>
                            <td
                                className="p-5 text-center"
                                colSpan={columns.length}
                            >
                                {noneNode}
                            </td>
                        </tr>
                    )}
                </tbody>

                {hasFooter && this.renderEdge('summary')}
            </Table>
        );
    }
}
