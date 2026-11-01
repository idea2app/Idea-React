'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

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
