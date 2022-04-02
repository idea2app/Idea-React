import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, ReactNode } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Base } from './IdeaTable';

export interface IdeaFormItem<T> {
    label: string;
    key?: string;
    required?: boolean;
    disabled?: boolean;
    show?: boolean;
    render?: (params?: T) => ReactNode;
    onChange?: (event: ChangeEvent) => any;
    tip?: string;
    pattern?: string;
}

export interface IdeaFormProps<T> {
    id?: string;
    rows: IdeaFormItem<T>[];
    data: T;
    labelCols?: number;
    controlCols?: number;
    className?: string;
    controlClassName?: string;
    submitText?: string;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
    resetText?: string;
    onReset?: (event: FormEvent<HTMLFormElement>) => void;
}

export default function IdeaForm<T extends Base>({
    rows,
    data,
    labelCols = 2,
    controlCols = 10,
    className,
    controlClassName = 'w-50',
    submitText = '',
    resetText = '',
    ...other
}: IdeaFormProps<T>) {
    return (
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
                                column="sm"
                                sm={labelCols}
                                className="text-end"
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
}
