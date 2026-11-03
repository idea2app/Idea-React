import classNames from 'classnames';
import { ReactNode } from 'react';

import { OVERLAY_ARROW_POSITIONS, OVERLAY_DIRECTIONS, OverlayTriggerProps } from './Overlay';
import { polymorphic } from './Polymorphic';

export interface PopoverProps extends Omit<OverlayTriggerProps, 'title'> {
    title?: ReactNode;
}

export const Popover = polymorphic<PopoverProps>(
    ({
        as: Root = 'div',
        title,
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
                'popover',
                { show },
                `bs-popover-${OVERLAY_DIRECTIONS[placement]}`,
                className
            )}
            role={role}
            hidden={!show}
            data-bs-placement={placement}
        >
            <div
                style={arrowStyle}
                className={classNames('popover-arrow', OVERLAY_ARROW_POSITIONS[placement])}
            />
            {title != null && <h3 className="popover-header">{title}</h3>}
            <div className="popover-body">{children}</div>
        </Root>
    )
);

Popover.displayName = 'Popover';
