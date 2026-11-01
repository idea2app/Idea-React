'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export type FormProps = ComponentPropsWithRef<'form'>;

export const Form: FC<FormProps> = props => <form {...props} />;

Form.displayName = 'Form';

export type FormFieldsetProps = ComponentPropsWithRef<'fieldset'>;

export const FormFieldset: FC<FormFieldsetProps> = props => <fieldset {...props} />;

FormFieldset.displayName = 'FormFieldset';

export type FormFieldProps = ComponentPropsWithRef<'div'>;

export const FormField: FC<FormFieldProps> = ({ className, ...props }) => (
    <div {...props} className={classNames('form-field', className)} />
);

FormField.displayName = 'FormField';

export type FormGroupProps = ComponentPropsWithRef<'div'>;

export const FormGroup: FC<FormGroupProps> = ({ className, ...props }) => (
    <div {...props} className={classNames('form-group', className)} />
);

FormGroup.displayName = 'FormGroup';

export type FormFieldContentProps = ComponentPropsWithRef<'div'>;

export const FormFieldContent: FC<FormFieldContentProps> = ({ className, ...props }) => (
    <div {...props} className={classNames('form-field-content', className)} />
);

FormFieldContent.displayName = 'FormFieldContent';

export type FormLabelProps = ComponentPropsWithRef<'label'>;

export const FormLabel: FC<FormLabelProps> = ({ className, ...props }) => (
    <label {...props} className={classNames('form-label', className)} />
);

FormLabel.displayName = 'FormLabel';
