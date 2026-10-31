'use client';

import classNames from 'classnames';
import { FC, ReactNode } from 'react';

import { CloseButton } from './CloseButton';
import { NativeDialog, NativeDialogProps } from './NativeDialog';

export type DrawerPlacement = 'start' | 'end' | 'top' | 'bottom';

export interface DrawerProps extends Omit<NativeDialogProps, 'dialog' | 'onClose' | 'title'> {
    title?: ReactNode;
    placement?: DrawerPlacement;
    footer?: ReactNode;
    bodyClassName?: string;
    onDismiss?: () => void;
}

export const Drawer: FC<DrawerProps> = ({
    title,
    placement = 'end',
    footer,
    bodyClassName,
    onDismiss,
    className,
    children,
    ...props
}) => (
    <NativeDialog
        {...props}
        dialog={false}
        tabIndex={-1}
        aria-label={typeof title === 'string' ? title : props['aria-label']}
        className={classNames('drawer', `drawer-${placement}`, className)}
        onClose={onDismiss}
    >
        <div className="drawer-header">
            <h5 className="drawer-title">{title}</h5>
            <CloseButton onClick={onDismiss} />
        </div>
        <div className={classNames('drawer-body', bodyClassName)}>{children}</div>
        {footer && <div className="drawer-footer">{footer}</div>}
    </NativeDialog>
);

Drawer.displayName = 'Drawer';
