import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, ReactNode } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export interface IdeaFormItem<T> {
    label: string;
    key?: string;
    required?: boolean;
    disabled?: boolean;
    show?: boolean;
    render?: (params?: T) => ReactNode;
    onChange?: (event: ChangeEvent) => void;
    tip?: string;
    pattern?: string;
}

export interface IdeaFormProps<T> {
    id?: string;
    rows: IdeaFormItem<T>[];
    data: T;
    labelWidth?: number;
    controlWidth?: number;
    className?: string;
    controlClassName?: string;
    showFooter?: boolean;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export default function IdeaForm<T>({
    rows,
    data,
    labelWidth = 2,
    controlWidth = 10,
    className,
    controlClassName = 'w-50',
    showFooter = true,
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
            <input type="hidden" name="objectId" value={data.id} />
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
                                sm={labelWidth}
                                className="text-right"
                            >
                                {required && (
                                    <span className="text-danger mr-1">*</span>
                                )}
                                {label}：
                            </Form.Label>

                            <Col sm={controlWidth}>
                                {render?.(data) || (
                                    <Form.Control
                                        className={controlClassName}
                                        size="sm"
                                        name={key}
                                        required={required}
                                        disabled={disabled}
                                        pattern={pattern}
                                        defaultValue={data[key]}
                                        onChange={onChange}
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
            {showFooter && (
                <Form.Group as={Row} className="mt-5 text-left">
                    <Col sm={{ offset: 2 }}>
                        <Button type="submit" className="mr-3">
                            提 交
                        </Button>
                    </Col>
                </Form.Group>
            )}
        </Form>
    );
}
