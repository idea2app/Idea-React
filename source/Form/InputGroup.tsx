import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export type InputGroupProps = ComponentPropsWithRef<'div'> & {
    size?: 'sm' | 'lg';
};

export const InputGroup: FC<InputGroupProps> = ({ className, size, ...props }) => (
    <div
        {...props}
        className={classNames('input-group', size && `input-group-${size}`, className)}
    />
);

InputGroup.displayName = 'InputGroup';

export type InputGroupTextProps = ComponentPropsWithRef<'span'>;

export const InputGroupText: FC<InputGroupTextProps> = ({ className, ...props }) => (
    <span {...props} className={classNames('input-group-text', className)} />
);

InputGroupText.displayName = 'InputGroupText';
