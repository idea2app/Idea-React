import classNames from 'classnames';
import { Children, ComponentPropsWithRef, FC, isValidElement, ReactNode } from 'react';

import { FormLabel } from './Primitives';

export type FormFloatingLabelProps = ComponentPropsWithRef<'div'> & {
    always?: boolean;
};

const isLabel = (child: ReactNode) =>
    isValidElement(child) && (child.type === 'label' || child.type === FormLabel);

export const FormFloatingLabel: FC<FormFloatingLabelProps> = ({
    className,
    always,
    children,
    ...props
}) => {
    const items = Children.toArray(children);

    return (
        <div
            {...props}
            className={classNames('form-floating', always && 'form-floating-always', className)}
        >
            {items.filter(isLabel)}
            {items.filter(item => !isLabel(item))}
        </div>
    );
};

FormFloatingLabel.displayName = 'FormFloatingLabel';
