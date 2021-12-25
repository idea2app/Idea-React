import { PropsWithoutRef } from 'react';
import Pagination from 'react-bootstrap/Pagination';

export type PaginationBarProps = PropsWithoutRef<{
    total: number;
    current: number;
    pathResolver: (index: number) => string;
}>;

export function PaginationBar({
    pathResolver,
    total,
    current
}: PaginationBarProps) {
    return !total ? null : (
        <Pagination className="justify-content-center">
            {current > 1 && (
                <Pagination.Item href={pathResolver(1)}>1</Pagination.Item>
            )}
            {current > 3 && <Pagination.Ellipsis />}
            {current > 2 && (
                <Pagination.Item href={pathResolver(current - 1)}>
                    {current - 1}
                </Pagination.Item>
            )}
            <Pagination.Item active>{current}</Pagination.Item>
            {current + 1 < total && (
                <Pagination.Item href={pathResolver(current + 1)}>
                    {current + 1}
                </Pagination.Item>
            )}
            {current + 2 < total && <Pagination.Ellipsis />}
            {current < total && (
                <Pagination.Item href={pathResolver(total)}>
                    {total}
                </Pagination.Item>
            )}
        </Pagination>
    );
}
