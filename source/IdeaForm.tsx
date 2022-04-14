import classNames from 'classnames';
import React, { ReactNode, ChangeEvent, FormEvent, FC } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { Base } from './IdeaTable';

export interface IdeaFormItem<T> {
    key?: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
    pattern?: string;
    tip?: string;
    show?: boolean;
    render?: (params?: T) => ReactNode;
    onChange?: (event: ChangeEvent) => any;
}

export interface IdeaFormProps<T> {
    id?: string;
    className?: string;
    controlClassName?: string;
    labelCols?: number;
    controlCols?: number;
    submitText?: string;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
    resetText?: string;
    onReset?: (event: FormEvent<HTMLFormElement>) => void;
    rows: IdeaFormItem<T>[];
    data: T;
}

export const IdeaForm = <T extends Base>({
    rows,
    data,
    labelCols = 2,
    controlCols = 10,
    className,
    controlClassName = 'w-50',
    submitText = '',
    resetText = '',
    ...other
}: IdeaFormProps<T>) => (
    <Form
        className={classNames(
            'my-3',
            'py-4',
            'px-5',
            'border-top',
            'w-75',
            className
        )}
        {...other}
    >
        <input type="hidden" name="id" value={data.id} />

        {rows.map(
            ({
                label,
                key,
                render,
                required = true,
                disabled = false,
                onChange,
                tip,
                pattern
            }) =>
                (key || render?.()) && (
                    <Form.Group
                        as={Row}
                        className="mb-3"
                        key={`${label}-${key}`}
                    >
                        <Form.Label
                            className="text-end"
                            column="sm"
                            sm={labelCols}
                        >
                            {required && (
                                <span className="text-danger me-1">*</span>
                            )}
                            {label}：
                        </Form.Label>

                        <Col sm={controlCols}>
                            {render?.(data) || (
                                <Form.Control
                                    className={controlClassName}
                                    size="sm"
                                    name={key}
                                    defaultValue={data[key]}
                                    {...{
                                        required,
                                        disabled,
                                        pattern,
                                        onChange
                                    }}
                                />
                            )}
                            {tip && (
                                <Form.Text className="text-muted">
                                    {tip}
                                </Form.Text>
                            )}
                        </Col>
                    </Form.Group>
                )
        )}
        {(submitText || resetText) && (
            <Form.Group as={Row} className="mt-5 text-left">
                <Col sm={{ offset: 2 }}>
                    {submitText && (
                        <Button type="submit" className="me-3">
                            {submitText}
                        </Button>
                    )}
                    {resetText && <Button type="reset">{resetText}</Button>}
                </Col>
            </Form.Group>
        )}
    </Form>
);

(IdeaForm as FC).displayName = 'IdeaForm';
