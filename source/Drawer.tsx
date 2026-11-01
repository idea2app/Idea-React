'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC, ReactNode } from 'react';

import { CloseButton } from './CloseButton';
import { NativeDialog, NativeDialogProps } from './NativeDialog';

export type DrawerPlacement = 'start' | 'end' | 'top' | 'bottom';

export const DrawerHeader: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('drawer-header', className)} />
);

export const DrawerTitle: FC<ComponentPropsWithRef<'h5'>> = ({ className, ...props }) => (
    <h5 {...props} className={classNames('drawer-title', className)} />
);

export const DrawerBody: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('drawer-body', className)} />
);

export const DrawerFooter: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('drawer-footer', className)} />
);

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
        <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <CloseButton onClick={onDismiss} />
        </DrawerHeader>
        <DrawerBody className={bodyClassName}>{children}</DrawerBody>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
    </NativeDialog>
);

Drawer.displayName = 'Drawer';
