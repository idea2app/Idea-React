import classNames from 'classnames';

import { OVERLAY_ARROW_POSITIONS, OVERLAY_DIRECTIONS, OverlayTriggerProps } from './Overlay';
import { polymorphic } from './Polymorphic';

export type TooltipProps = OverlayTriggerProps;

export const Tooltip = polymorphic<TooltipProps>(
    ({
        as: Root = 'div',
        placement = 'top',
        show = true,
        role = 'tooltip',
        className,
        children,
        arrowStyle,
        ...props
    }) => (
        <Root
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
        </Root>
    )
);
Tooltip.displayName = 'Tooltip';
