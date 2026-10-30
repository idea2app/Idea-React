import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import { OVERLAY_DIRECTIONS, OverlayPlacement } from './Overlay';

export interface TooltipProps extends ComponentPropsWithRef<'div'> {
    placement?: OverlayPlacement;
    show?: boolean;
}

export const Tooltip: FC<TooltipProps> = ({
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
            'tooltip',
            { show },
            `bs-tooltip-${OVERLAY_DIRECTIONS[placement]}`,
            className
        )}
        role={role}
        data-bs-placement={placement}
    >
        <div className="tooltip-arrow" />
        <div className="tooltip-inner">{children}</div>
    </div>
);

Tooltip.displayName = 'Tooltip';
