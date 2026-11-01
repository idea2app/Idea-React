import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export type FormAdornmentProps = Omit<ComponentPropsWithRef<'label'>, 'htmlFor'> & {
    end?: boolean;
    size?: 'sm' | 'lg';
    htmlFor?: string;
};

export const FormAdornment: FC<FormAdornmentProps> = ({ className, end, size, ...props }) => (
    <label
        {...props}
        className={classNames(
            'form-control form-adorn',
            end && 'form-adorn-end',
            size && `form-adorn-${size}`,
            className
        )}
    />
);

FormAdornment.displayName = 'FormAdornment';

export type FormAdornmentTextProps = ComponentPropsWithRef<'span'>;

export const FormAdornmentText: FC<FormAdornmentTextProps> = ({ className, ...props }) => (
    <span {...props} className={classNames('form-adorn-text', className)} />
);

FormAdornmentText.displayName = 'FormAdornmentText';

export type FormGhostProps = ComponentPropsWithRef<'input'>;

export const FormGhost: FC<FormGhostProps> = ({ className, ...props }) => (
    <input {...props} className={classNames('form-ghost', className)} />
);

FormGhost.displayName = 'FormGhost';
