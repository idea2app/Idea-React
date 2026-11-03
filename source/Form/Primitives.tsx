import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Polymorphic';

export type FormProps = ComponentPropsWithRef<'form'> & {
    validated?: boolean;
};

export const Form = polymorphic<FormProps>(
    ({ as: Root = 'form', className, validated, ...props }) => (
        <Root {...props} className={classNames(validated && 'was-validated', className)} />
    )
);

Form.displayName = 'Form';

export type FormFieldsetProps = ComponentPropsWithRef<'fieldset'>;

export const FormFieldset = polymorphic<FormFieldsetProps>(
    ({ as: Root = 'fieldset', ...props }) => <Root {...props} />
);

FormFieldset.displayName = 'FormFieldset';

export type FormFieldProps = ComponentPropsWithRef<'div'> & {
    card?: boolean;
};

export const FormField = polymorphic<FormFieldProps>(
    ({ as: Root = 'div', className, card, ...props }) => (
        <Root
            {...props}
            className={classNames('form-field', card && 'form-field-card', className)}
        />
    )
);

FormField.displayName = 'FormField';

export type FormGroupProps = ComponentPropsWithRef<'div'>;

export const FormGroup = polymorphic<FormGroupProps>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('form-group', className)} />
    )
);

FormGroup.displayName = 'FormGroup';

export type FormFieldContentProps = ComponentPropsWithRef<'div'>;

export const FormFieldContent = polymorphic<FormFieldContentProps>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('form-field-content', className)} />
    )
);

FormFieldContent.displayName = 'FormFieldContent';

export interface FormValidationProps {
    validation?: 'valid' | 'invalid';
}

export type FormLabelProps = ComponentPropsWithRef<'label'> & {
    plain?: boolean;
    column?: boolean;
    controlSize?: 'sm' | 'lg';
};

export const FormLabel = polymorphic<FormLabelProps>(
    ({ as: Root = 'label', className, plain, column, controlSize, ...props }) => (
        <Root
            {...props}
            className={classNames(
                column ? 'col-form-label' : !plain && 'form-label',
                column && controlSize && `col-form-label-${controlSize}`,
                className
            )}
        />
    )
);

FormLabel.displayName = 'FormLabel';

export type FormLegendProps = ComponentPropsWithRef<'legend'> &
    Pick<FormLabelProps, 'column' | 'controlSize'>;

export const FormLegend = polymorphic<FormLegendProps>(
    ({ as: Root = 'legend', className, column, controlSize, ...props }) => (
        <Root
            {...props}
            className={classNames(
                column && 'col-form-label',
                column && controlSize && `col-form-label-${controlSize}`,
                className
            )}
        />
    )
);
FormLegend.displayName = 'FormLegend';
