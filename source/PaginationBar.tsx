import classNames from 'classnames';
import React, { FC } from 'react';
import { Pagination, PaginationProps } from 'react-bootstrap';

export interface PaginationBarProps extends Omit<PaginationProps, 'onChange'> {
    currentPage?: number;
    pageCount: number;
    count?: number;
    onChange: (index: number) => any;
}

export const PaginationBar: FC<PaginationBarProps> = ({
    currentPage = 1,
    pageCount,
    count,
    onChange,
    className,
    ...props
}) =>
    !pageCount ? null : (
        <Pagination
            className={classNames(
                'd-flex',
                'justify-content-end',
                'align-items-center',
                className
            )}
            {...props}
        >
            {currentPage > 1 && (
                <Pagination.Item onClick={() => onChange(1)}>1</Pagination.Item>
            )}
            {currentPage > 3 && <Pagination.Ellipsis />}
            {currentPage > 2 && (
                <Pagination.Item onClick={() => onChange(currentPage - 1)}>
                    {currentPage - 1}
                </Pagination.Item>
            )}
            <Pagination.Item active>{currentPage}</Pagination.Item>
            {pageCount - currentPage > 1 && (
                <Pagination.Item onClick={() => onChange(currentPage + 1)}>
                    {currentPage + 1}
                </Pagination.Item>
            )}
            {pageCount - currentPage > 2 && <Pagination.Ellipsis />}
            {currentPage < pageCount && (
                <Pagination.Item onClick={() => onChange(pageCount)}>
                    {pageCount}
                </Pagination.Item>
            )}
            {count && <span className="mx-3 fs14">Total {count} rows</span>}
        </Pagination>
    );

PaginationBar.displayName = 'PaginationBar';
