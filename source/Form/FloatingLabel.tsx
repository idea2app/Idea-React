import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

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
