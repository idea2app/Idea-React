import { ComponentPropsWithRef } from 'react';

export type OverlayPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface OverlayTriggerProps extends ComponentPropsWithRef<'div'> {
    placement?: OverlayPlacement;
    show?: boolean;
}

export const OVERLAY_DIRECTIONS: Record<OverlayPlacement, string> = {
    top: 'top',
    right: 'end',
    bottom: 'bottom',
    left: 'start'
};

export const OVERLAY_ARROW_POSITIONS: Record<OverlayPlacement, string> = {
    top: 'position-absolute start-50 translate-middle-x',
    right: 'position-absolute top-50 translate-middle-y',
    bottom: 'position-absolute start-50 translate-middle-x',
    left: 'position-absolute top-50 translate-middle-y'
};
