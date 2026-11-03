import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export type FormTextProps = ComponentPropsWithRef<'small'> & {
    block?: boolean;
};

export const FormText: FC<FormTextProps> = ({ className, block, ...props }) => (
    <small {...props} className={classNames('form-text', block && 'd-block', className)} />
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
        className={classNames(
            tooltip && 'tooltip',
            tooltip ? `${type}-tooltip` : `${type}-feedback`,
            className
        )}
    />
);

FormFeedback.displayName = 'FormFeedback';
