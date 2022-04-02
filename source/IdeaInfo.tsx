import React, { ReactNode } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export interface IdeaInfoItem<T> {
    label: string;
    key?: string;
    render?: (params: T) => ReactNode;
}

export interface IdeaInfoProps<T> {
    rows: IdeaInfoItem<T>[];
    data: T;
}

export default function IdeaInfo<T>({
    rows,
    data,
    ...other
}: IdeaInfoProps<T>) {
    return (
        <Form className="p-5" {...other}>
            {rows.map(({ label, key, render }) => (
                <Form.Group as={Row} className="mb-3" key={`${label}-${key}`}>
                    <Form.Label column="sm" sm={2} className="text-end">
                        {label}：
                    </Form.Label>
                    <Col sm={10} className="align-self-center">
                        {render?.(data) || data?.[key]}
                    </Col>
                </Form.Group>
            ))}
        </Form>
    );
}
