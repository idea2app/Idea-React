'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ComponentPropsWithRef, createRef, ElementType, ReactNode } from 'react';

import { AsProps, polymorphic, PolymorphicClassProps } from '../Helper/Polymorphic';
import { Breakpoint } from '../Layout/Grid';
import { CloseButton } from './CloseButton';
import { Dialog, DialogProps } from './Dialog';

export type DrawerPlacement = 'start' | 'end' | 'top' | 'bottom';

export const DrawerHeader = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('drawer-header', className)} />
    )
);
DrawerHeader.displayName = 'DrawerHeader';

export const DrawerTitle = polymorphic<ComponentPropsWithRef<'h5'>>(
    ({ as: Root = 'h5', className, ...props }) => (
        <Root {...props} className={classNames('drawer-title', className)} />
    )
);
DrawerTitle.displayName = 'DrawerTitle';

export const DrawerBody = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('drawer-body', className)} />
    )
);
DrawerBody.displayName = 'DrawerBody';

export const DrawerFooter = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('drawer-footer', className)} />
    )
);
DrawerFooter.displayName = 'DrawerFooter';

export interface DrawerProps extends Omit<
    DialogProps,
    'dialog' | 'onClose' | 'title' | 'animation' | 'fullscreen'
> {
    title?: ReactNode;
    placement?: DrawerPlacement;
    footer?: ReactNode;
    bodyClassName?: string;
    sheet?: boolean;
    translucent?: boolean;
    responsive?: Breakpoint;
    fullscreen?: boolean;
    animation?: 'slide' | 'instant';
    onDismiss?: () => unknown;
}

const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
    sm: 576,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
};

@observer
export class Drawer<T extends ElementType | undefined = 'dialog'> extends Component<
    PolymorphicClassProps<T, DrawerProps>
> {
    declare readonly props: PolymorphicClassProps<T, DrawerProps>;

    protected get componentProps(): Readonly<DrawerProps & AsProps> {
        return this.props;
    }

    static displayName = 'Drawer';

    @observable accessor expanded = false;

    dialog = createRef<Dialog<ElementType>>();
    media?: MediaQueryList;
    dismissed = false;

    componentDidMount() {
        this.observeBreakpoint();
    }

    componentDidUpdate({ responsive, open }: DrawerProps) {
        if (responsive !== this.componentProps.responsive) this.observeBreakpoint();

        if (open !== this.componentProps.open && this.componentProps.open) this.dismissed = false;
    }

    componentWillUnmount() {
        this.media?.removeEventListener('change', this.handleBreakpoint);
    }

    observeBreakpoint = () => {
        this.media?.removeEventListener('change', this.handleBreakpoint);

        const { responsive } = this.componentProps;
        this.media = responsive
            ? window.matchMedia(`(min-width: ${BREAKPOINT_WIDTHS[responsive]}px)`)
            : undefined;
        this.handleBreakpoint();
        this.media?.addEventListener('change', this.handleBreakpoint);
    };

    @action
    handleBreakpoint = () => (this.expanded = this.media?.matches ?? false);

    handleDismiss = () => {
        this.componentProps.onDismiss?.();

        this.dismissed = true;
        this.dialog.current?.close();
    };

    handleClose = () => {
        if (!this.dismissed && !this.expanded) this.componentProps.onDismiss?.();

        this.dismissed = false;
    };

    render() {
        const {
            as: _as,
            title,
            placement = 'end',
            footer,
            bodyClassName,
            onDismiss: _onDismiss,
            sheet,
            translucent,
            responsive,
            animation = 'slide',
            fullscreen,
            open,
            modal,
            scroll,
            backdrop,
            className,
            children,
            ...props
        } = this.componentProps;

        return (
            <Dialog
                as={this.componentProps.as}
                {...props}
                ref={this.dialog}
                open={this.expanded || open}
                modal={this.expanded ? false : (modal ?? !(scroll && backdrop === false))}
                scroll={scroll}
                backdrop={backdrop}
                dialog={false}
                tabIndex={-1}
                aria-label={typeof title === 'string' ? title : props['aria-label']}
                className={classNames(
                    responsive ? `${responsive}:drawer` : 'drawer',
                    `drawer-${placement}`,
                    {
                        'drawer-sheet': sheet,
                        'drawer-translucent': translucent,
                        'drawer-instant': animation === 'instant',
                        'drawer-fullscreen': fullscreen === true
                    },
                    className
                )}
                onClose={this.handleClose}
            >
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    <CloseButton onClick={this.handleDismiss} />
                </DrawerHeader>
                <DrawerBody className={bodyClassName}>{children}</DrawerBody>
                {footer && <DrawerFooter>{footer}</DrawerFooter>}
            </Dialog>
        );
    }
}
