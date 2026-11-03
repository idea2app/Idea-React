import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from './Polymorphic';

export interface ButtonGroupProps extends ComponentPropsWithRef<'div'> {
    vertical?: boolean;
    size?: 'xs' | 'sm' | 'lg';
    divider?: boolean;
}

export const ButtonGroup = polymorphic<ButtonGroupProps>(
    ({ as: Root = 'div', vertical, size, divider, role = 'group', className, ...props }) => (
        <Root
            role={role}
            {...props}
            className={classNames(
                vertical ? 'btn-group-vertical' : 'btn-group',
                size && `btn-group-${size}`,
                divider && 'btn-group-divider',
                className
            )}
        />
    )
);
ButtonGroup.displayName = 'ButtonGroup';

export const ButtonToolbar = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, role = 'toolbar', ...props }) => (
        <Root role={role} {...props} className={classNames('btn-toolbar', className)} />
    )
);

ButtonToolbar.displayName = 'ButtonToolbar';
