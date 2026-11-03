import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Polymorphic';

export type FormTextProps = ComponentPropsWithRef<'small'> & {
    block?: boolean;
};

export const FormText = polymorphic<FormTextProps>(
    ({ as: Root = 'small', className, block, ...props }) => (
        <Root {...props} className={classNames('form-text', block && 'd-block', className)} />
    )
);

FormText.displayName = 'FormText';

export type FormFeedbackProps = Omit<ComponentPropsWithRef<'div'>, 'type'> & {
    type?: 'valid' | 'invalid';
    tooltip?: boolean;
};

export const FormFeedback = polymorphic<FormFeedbackProps>(
    ({ as: Root = 'div', className, type = 'invalid', tooltip, ...props }) => (
        <Root
            {...props}
            className={classNames(
                tooltip && 'tooltip',
                tooltip ? `${type}-tooltip` : `${type}-feedback`,
                className
            )}
        />
    )
);

FormFeedback.displayName = 'FormFeedback';
