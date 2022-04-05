import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Row, Col, Form } from 'react-bootstrap';

export interface IdeaInfoItem<T> {
    label: string;
    key?: string;
    render?: (params: T) => ReactNode;
}

export interface IdeaInfoProps<T> {
    className?: string;
    rows: IdeaInfoItem<T>[];
    data: T;
}

export function IdeaInfo<T>({
    className,
    rows,
    data,
    ...other
}: IdeaInfoProps<T>) {
    return (
        <Form className={classNames('p-5', className)} {...other}>
            {rows.map(({ label, key, render }) => (
                <Form.Group as={Row} className="mb-3" key={`${label}-${key}`}>
                    <Form.Label className="text-end" column="sm" sm={2}>
                        {label}：
                    </Form.Label>
                    <Col className="align-self-center" sm={10}>
                        {render?.(data) || data?.[key]}
                    </Col>
                </Form.Group>
            ))}
        </Form>
    );
}
