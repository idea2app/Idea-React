import { FC } from 'react';

import { Nav, NavProps } from '../Nav';
import { ScrollNavScroller } from './Scroller';

export type ScrollNavProps = NavProps;

/**
 * A horizontal scrolling navigation bar based on Bootstrap's `nav-scroller` pattern.
 * Automatically shows scroll arrow buttons when nav items overflow the container width.
 *
 * @see {@link https://github.com/twbs/bootstrap/blob/main/site/src/assets/examples/offcanvas-navbar/index.astro#L50-L65}
 */
export const ScrollNav: FC<ScrollNavProps> = ({ className = '', children, ...props }) => (
    <ScrollNavScroller className={className}>
        <Nav {...props} className="flex-nowrap">
            {children}
        </Nav>
    </ScrollNavScroller>
);

ScrollNav.displayName = 'ScrollNav';
