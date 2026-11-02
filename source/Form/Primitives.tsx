import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export type FormProps = ComponentPropsWithRef<'form'> & {
    validated?: boolean;
};

export const Form: FC<FormProps> = ({ className, validated, ...props }) => (
    <form {...props} className={classNames(validated && 'was-validated', className)} />
);

Form.displayName = 'Form';

export type FormFieldsetProps = ComponentPropsWithRef<'fieldset'>;

export const FormFieldset: FC<FormFieldsetProps> = props => <fieldset {...props} />;

FormFieldset.displayName = 'FormFieldset';

export type FormFieldProps = ComponentPropsWithRef<'div'> & {
    card?: boolean;
};

export const FormField: FC<FormFieldProps> = ({ className, card, ...props }) => (
    <div {...props} className={classNames('form-field', card && 'form-field-card', className)} />
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

export interface FormValidationProps {
    validation?: 'valid' | 'invalid';
}

export type FormLabelProps = ComponentPropsWithRef<'label'> & {
    plain?: boolean;
    column?: boolean;
    controlSize?: 'sm' | 'lg';
};

export const FormLabel: FC<FormLabelProps> = ({
    className,
    plain,
    column,
    controlSize,
    ...props
}) => (
    <label
        {...props}
        className={classNames(
            column ? 'col-form-label' : !plain && 'form-label',
            column && controlSize && `col-form-label-${controlSize}`,
            className
        )}
    />
);

FormLabel.displayName = 'FormLabel';

export type FormLegendProps = ComponentPropsWithRef<'legend'> &
    Pick<FormLabelProps, 'column' | 'controlSize'>;

export const FormLegend: FC<FormLegendProps> = ({ className, column, controlSize, ...props }) => (
    <legend
        {...props}
        className={classNames(
            column && 'col-form-label',
            column && controlSize && `col-form-label-${controlSize}`,
            className
        )}
    />
);

FormLegend.displayName = 'FormLegend';
