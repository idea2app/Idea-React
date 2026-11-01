import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export type FormProps = ComponentPropsWithRef<'form'>;

export const Form: FC<FormProps> = props => <form {...props} />;

Form.displayName = 'Form';

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

export type FormLabelProps = ComponentPropsWithRef<'label'>;

export const FormLabel: FC<FormLabelProps> = ({ className, ...props }) => (
    <label {...props} className={classNames('form-label', className)} />
);

FormLabel.displayName = 'FormLabel';

export type FormControlProps = ComponentPropsWithRef<'input'> & {
    plaintext?: boolean;
};

export const FormControl: FC<FormControlProps> = ({ className, plaintext, ...props }) => (
    <input
        {...props}
        className={classNames(plaintext ? 'form-control-plaintext' : 'form-control', className)}
    />
);

FormControl.displayName = 'FormControl';

export type FormTextAreaProps = ComponentPropsWithRef<'textarea'>;

export const FormTextArea: FC<FormTextAreaProps> = ({ className, ...props }) => (
    <textarea {...props} className={classNames('form-control', className)} />
);

FormTextArea.displayName = 'FormTextArea';

export type FormSelectProps = ComponentPropsWithRef<'select'>;

export const FormSelect: FC<FormSelectProps> = ({ className, ...props }) => (
    <select {...props} className={classNames('form-control', className)} />
);

FormSelect.displayName = 'FormSelect';

export type FormCheckProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
    type?: 'checkbox' | 'radio';
};

export const FormCheck: FC<FormCheckProps> = ({ className, type = 'checkbox', ...props }) => (
    <input
        {...props}
        type={type}
        className={classNames(type === 'checkbox' ? 'check' : 'radio', className)}
    />
);

FormCheck.displayName = 'FormCheck';

export type FormTextProps = ComponentPropsWithRef<'small'>;

export const FormText: FC<FormTextProps> = ({ className, ...props }) => (
    <small {...props} className={classNames('form-text', className)} />
);

FormText.displayName = 'FormText';

export type FormFeedbackProps = Omit<ComponentPropsWithRef<'div'>, 'type'> & {
    type?: 'valid' | 'invalid';
    tooltip?: boolean;
};

export const FormFeedback: FC<FormFeedbackProps> = ({
    className,
    type = 'invalid',
    tooltip,
    ...props
}) => (
    <div
        {...props}
        className={classNames(tooltip ? `${type}-tooltip` : `${type}-feedback`, className)}
    />
);

FormFeedback.displayName = 'FormFeedback';

export type FormFloatingLabelProps = ComponentPropsWithRef<'div'> & {
    always?: boolean;
};

export const FormFloatingLabel: FC<FormFloatingLabelProps> = ({ className, always, ...props }) => (
    <div
        {...props}
        className={classNames('form-floating', always && 'form-floating-always', className)}
    />
);

FormFloatingLabel.displayName = 'FormFloatingLabel';

export type InputGroupProps = ComponentPropsWithRef<'div'>;

export const InputGroup: FC<InputGroupProps> = ({ className, ...props }) => (
    <div {...props} className={classNames('input-group', className)} />
);

InputGroup.displayName = 'InputGroup';

export type InputGroupTextProps = ComponentPropsWithRef<'span'>;

export const InputGroupText: FC<InputGroupTextProps> = ({ className, ...props }) => (
    <span {...props} className={classNames('input-group-text', className)} />
);

InputGroupText.displayName = 'InputGroupText';
