export type OverlayPlacement = 'top' | 'right' | 'bottom' | 'left';

export const OVERLAY_DIRECTIONS: Record<OverlayPlacement, string> = {
    top: 'top',
    right: 'end',
    bottom: 'bottom',
    left: 'start'
};
