import React, { PropsWithoutRef } from 'react';
import Pagination, { PaginationProps } from 'react-bootstrap/Pagination';

export type PaginationBarProps = PropsWithoutRef<
    PaginationProps & {
        currentPage?: number;
        pageCount: number;
        count?: number;
        className: string;
        onChange(index: number): void;
    }
>;

export function PaginationBar({
    currentPage = 1,
    pageCount,
    count,
    onChange,
    className,
    ...props
}: PaginationBarProps) {
    return !pageCount ? null : (
        <Pagination
            className={`d-flex justify-content-end align-items-center ${className}`}
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
            {count && <span className="mx-3 fs14">总共{count}条</span>}
        </Pagination>
    );
}
