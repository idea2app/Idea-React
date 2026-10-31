import classNames from 'classnames';
import { ComponentPropsWithRef, FC, ReactNode } from 'react';

import { OVERLAY_DIRECTIONS, OverlayPlacement } from './Overlay';

export interface PopoverProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
    title?: ReactNode;
    placement?: OverlayPlacement;
    show?: boolean;
}

export const Popover: FC<PopoverProps> = ({
    title,
    placement = 'top',
    show = true,
    role = 'tooltip',
    className,
    children,
    ...props
}) => (
    <div
        {...props}
        className={classNames(
            'popover',
            { show },
            `bs-popover-${OVERLAY_DIRECTIONS[placement]}`,
            className
        )}
        role={role}
        data-bs-placement={placement}
    >
        <div className="popover-arrow" />
        <h3 className="popover-header">{title}</h3>
        <div className="popover-body">{children}</div>
    </div>
);

Popover.displayName = 'Popover';
