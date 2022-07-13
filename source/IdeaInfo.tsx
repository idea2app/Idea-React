import React, { FC, ReactNode } from 'react';
import { Row, Col, Form } from 'react-bootstrap';

export interface IdeaInfoItem<T> {
    label: ReactNode | ((field: IdeaInfoItem<T>) => ReactNode);
    labelCol?: number;
    key?: string;
    render?: (params: T) => ReactNode;
}

export interface IdeaInfoProps<T> {
    className?: string;
    rows: IdeaInfoItem<T>[];
    data: T;
}

export const IdeaInfo = <T,>({ rows, data, ...other }: IdeaInfoProps<T>) => (
    <Form {...other}>
        {rows.map(({ label, key, render, labelCol, ...field }, index) => {
            label =
                typeof label !== 'function'
                    ? label
                    : label({ label, key, render, labelCol, ...field });

            return (
                <Form.Group
                    as={Row}
                    className="mb-3"
                    key={key || `field-${index}`}
                >
                    <Form.Label className="text-end" column="sm" sm={labelCol}>
                        {label}
                    </Form.Label>
                    <Col className="align-self-center" sm={12 - labelCol}>
                        {render?.(data) || data?.[key]}
                    </Col>
                </Form.Group>
            );
        })}
    </Form>
);

(IdeaInfo as FC).displayName = 'IdeaInfo';
