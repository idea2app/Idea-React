import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export interface ButtonGroupProps extends ComponentPropsWithRef<'div'> {
    vertical?: boolean;
    size?: 'xs' | 'sm' | 'lg';
    divider?: boolean;
}

export const ButtonGroup: FC<ButtonGroupProps> = ({
    vertical,
    size,
    divider,
    role = 'group',
    className,
    ...props
}) => (
    <div
        role={role}
        {...props}
        className={classNames(
            vertical ? 'btn-group-vertical' : 'btn-group',
            size && `btn-group-${size}`,
            divider && 'btn-group-divider',
            className
        )}
    />
);
ButtonGroup.displayName = 'ButtonGroup';

export const ButtonToolbar: FC<ComponentPropsWithRef<'div'>> = ({
    className,
    role = 'toolbar',
    ...props
}) => <div role={role} {...props} className={classNames('btn-toolbar', className)} />;

ButtonToolbar.displayName = 'ButtonToolbar';
