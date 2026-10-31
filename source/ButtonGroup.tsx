import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export interface ButtonGroupProps extends ComponentPropsWithRef<'div'> {
    vertical?: boolean;
}

export const ButtonGroup: FC<ButtonGroupProps> = ({
    vertical,
    role = 'group',
    className,
    ...props
}) => (
    <div
        role={role}
        {...props}
        className={classNames(vertical ? 'btn-group-vertical' : 'btn-group', className)}
    />
);

ButtonGroup.displayName = 'ButtonGroup';
