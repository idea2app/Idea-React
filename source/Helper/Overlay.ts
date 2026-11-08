import { action, observable } from 'mobx';
import { ComponentPropsWithRef, CSSProperties } from 'react';

import { Breakpoint } from '../Layout/Grid';

export type OverlayPlacement = 'top' | 'right' | 'bottom' | 'left';
export type FloatingPlacement = OverlayPlacement | `${OverlayPlacement}-${'start' | 'end'}`;
export type OverlayOffset = number | readonly [number, number];
export type OverlayContainer = string | HTMLElement | (() => HTMLElement);

export interface FloatingOptions {
    placement?: FloatingPlacement;
    responsivePlacement?: Partial<Record<Breakpoint, FloatingPlacement>>;
    offset?: OverlayOffset;
    padding?: number;
    flip?: boolean;
}

const BREAKPOINTS: Record<Breakpoint, number> = {
    sm: 576,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
};
const OPPOSITE: Record<OverlayPlacement, OverlayPlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
};

/** Owns geometry and subscriptions shared by menus, tooltips and popovers. */
export class FloatingPosition {
    @observable accessor placement: FloatingPlacement = 'top';
    @observable accessor style: CSSProperties = {};
    @observable accessor arrowStyle: CSSProperties = {};

    reference?: HTMLElement;
    element?: HTMLElement;
    resize?: ResizeObserver;
    options: FloatingOptions = {};

    attach(reference: HTMLElement, element: HTMLElement, options: FloatingOptions) {
        this.dispose();
        this.reference = reference;
        this.element = element;
        this.options = options;

        window.addEventListener('resize', this.update);
        document.addEventListener('scroll', this.update, true);

        this.resize = new window.ResizeObserver(this.update);
        this.resize.observe(reference);
        this.resize.observe(element);
        this.update();
    }

    dispose = () => {
        window.removeEventListener('resize', this.update);
        document.removeEventListener('scroll', this.update, true);
        this.resize?.disconnect();
        this.resize = undefined;
        this.reference = undefined;
        this.element = undefined;
    };

    @action
    update = () => {
        const { reference, element, options } = this;
        if (!reference || !element) return;

        const { responsivePlacement, offset = 0, padding = 8, flip = true } = options;
        const responsive = (Object.keys(BREAKPOINTS) as Breakpoint[])
            .reverse()
            .find(key => window.innerWidth >= BREAKPOINTS[key] && responsivePlacement?.[key]);
        const preferred =
            (responsive && responsivePlacement?.[responsive]) || options.placement || 'top';
        const [side, alignment] = preferred.split('-') as [
            OverlayPlacement,
            'start' | 'end' | undefined
        ];
        const anchor = reference.getBoundingClientRect();
        const box = element.getBoundingClientRect();
        const [skid, distance] = typeof offset === 'number' ? [0, offset] : offset;
        const available: Record<OverlayPlacement, number> = {
            top: anchor.top - padding,
            bottom: window.innerHeight - anchor.bottom - padding,
            left: anchor.left - padding,
            right: window.innerWidth - anchor.right - padding
        };
        const required = (side === 'top' || side === 'bottom' ? box.height : box.width) + distance;
        const actual =
            flip && available[side] < required && available[OPPOSITE[side]] > available[side]
                ? OPPOSITE[side]
                : side;
        let left = anchor.left + (anchor.width - box.width) / 2;
        let top = anchor.top + (anchor.height - box.height) / 2;

        if (actual === 'top' || actual === 'bottom') {
            top = actual === 'top' ? anchor.top - box.height - distance : anchor.bottom + distance;
            if (alignment) left = alignment === 'start' ? anchor.left : anchor.right - box.width;
            left += skid;
        } else {
            left = actual === 'left' ? anchor.left - box.width - distance : anchor.right + distance;
            if (alignment) top = alignment === 'start' ? anchor.top : anchor.bottom - box.height;
            top += skid;
        }
        left = Math.max(padding, Math.min(left, window.innerWidth - box.width - padding));
        top = Math.max(padding, Math.min(top, window.innerHeight - box.height - padding));

        const arrowStyle: CSSProperties =
            actual === 'top' || actual === 'bottom'
                ? {
                      left: Math.max(
                          8,
                          Math.min(box.width - 8, anchor.left + anchor.width / 2 - left)
                      )
                  }
                : {
                      top: Math.max(
                          8,
                          Math.min(box.height - 8, anchor.top + anchor.height / 2 - top)
                      )
                  };
        if (this.arrowStyle.left !== arrowStyle.left || this.arrowStyle.top !== arrowStyle.top)
            this.arrowStyle = arrowStyle;

        const parent = element.offsetParent;
        const positionedParent =
            parent instanceof HTMLElement &&
            !(parent === document.body && getComputedStyle(parent).position === 'static')
                ? parent
                : undefined;
        const parentBox = positionedParent?.getBoundingClientRect();
        left += positionedParent
            ? positionedParent.scrollLeft - parentBox!.left - positionedParent.clientLeft
            : window.scrollX;
        top += positionedParent
            ? positionedParent.scrollTop - parentBox!.top - positionedParent.clientTop
            : window.scrollY;
        const placement: FloatingPlacement = alignment ? `${actual}-${alignment}` : actual;
        if (this.placement !== placement) this.placement = placement;

        const maxWidth = Math.max(0, window.innerWidth - padding * 2);
        const maxHeight = Math.max(0, window.innerHeight - padding * 2);
        if (
            this.style.left !== left ||
            this.style.top !== top ||
            this.style.maxWidth !== maxWidth ||
            this.style.maxHeight !== maxHeight
        )
            this.style = {
                position: 'absolute',
                left,
                top,
                right: 'auto',
                bottom: 'auto',
                margin: 0,
                maxWidth,
                maxHeight
            };
    };
}

export interface OverlayTriggerProps extends ComponentPropsWithRef<'div'> {
    placement?: OverlayPlacement;
    show?: boolean;
    arrowStyle?: CSSProperties;
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
