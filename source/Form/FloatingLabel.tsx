import classNames from 'classnames';
import { Children, ComponentPropsWithRef, isValidElement, ReactNode } from 'react';

import { polymorphic } from '../Polymorphic';
import { FormLabel } from './Primitives';

export type FormFloatingLabelProps = ComponentPropsWithRef<'div'> & {
    always?: boolean;
};

const isLabel = (child: ReactNode) =>
    isValidElement(child) && (child.type === 'label' || child.type === FormLabel);

export const FormFloatingLabel = polymorphic<FormFloatingLabelProps>(
    ({ as: Root = 'div', className, always, children, ...props }) => {
        const items = Children.toArray(children);

        return (
            <Root
                {...props}
                className={classNames('form-floating', always && 'form-floating-always', className)}
            >
                {items.filter(isLabel)}
                {items.filter(item => !isLabel(item))}
            </Root>
        );
    }
);
FormFloatingLabel.displayName = 'FormFloatingLabel';
