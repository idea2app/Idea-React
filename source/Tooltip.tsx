import classNames from 'classnames';
import { FC } from 'react';

import { OVERLAY_ARROW_POSITIONS, OVERLAY_DIRECTIONS, OverlayTriggerProps } from './Overlay';

export type TooltipProps = OverlayTriggerProps;

export const Tooltip: FC<TooltipProps> = ({
    placement = 'top',
    show = true,
    role = 'tooltip',
    className,
    children,
    arrowStyle,
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
        hidden={!show}
        data-bs-placement={placement}
    >
        <div
            style={arrowStyle}
            className={classNames('tooltip-arrow', OVERLAY_ARROW_POSITIONS[placement])}
        />
        <div className="tooltip-inner">{children}</div>
    </div>
);

Tooltip.displayName = 'Tooltip';
