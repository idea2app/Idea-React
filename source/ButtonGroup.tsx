import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export const ButtonGroup: FC<ComponentPropsWithRef<'div'>> = ({
    role = 'group',
    className,
    ...props
}) => <div role={role} {...props} className={classNames('btn-group', className)} />;

ButtonGroup.displayName = 'ButtonGroup';
