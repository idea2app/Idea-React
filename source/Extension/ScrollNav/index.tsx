import { ElementType } from 'react';

import { Nav, NavProps } from '../../Base/Nav';
import { polymorphic } from '../../Helper/Polymorphic';
import { ScrollNavScroller } from './Scroller';

export type ScrollNavProps = NavProps;

/**
 * A horizontal scrolling navigation bar based on Bootstrap's `nav-scroller` pattern.
 * Automatically shows scroll arrow buttons when nav items overflow the container width.
 *
 * @see {@link https://github.com/twbs/bootstrap/blob/main/site/src/assets/examples/offcanvas-navbar/index.astro#L50-L65}
 */
export const ScrollNav = polymorphic<ScrollNavProps>(
    ({
        as: RootAs,
        className = '',
        children,
        ref,
        variant,
        vertical,
        fill,
        justified,
        cardHeader,
        navbar,
        ...props
    }) => (
        <ScrollNavScroller<ElementType>
            as={RootAs}
            {...(RootAs ? props : {})}
            rootRef={RootAs ? ref : undefined}
            className={className}
        >
            <Nav
                {...(RootAs ? {} : props)}
                ref={RootAs ? undefined : ref}
                className="flex-nowrap"
                {...{ variant, vertical, fill, justified, cardHeader, navbar }}
            >
                {children}
            </Nav>
        </ScrollNavScroller>
    )
);

ScrollNav.displayName = 'ScrollNav';
