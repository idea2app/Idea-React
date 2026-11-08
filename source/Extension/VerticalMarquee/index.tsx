import { HTMLAttributes } from 'react';

import { polymorphic } from '../../Base/Polymorphic';
import * as style from './index.module.less';

export interface VerticalMarqueeProps extends HTMLAttributes<HTMLDivElement> {
    duration?: string;
}

export const VerticalMarquee = polymorphic<VerticalMarqueeProps>(
    ({ as: Root = 'div', className = '', children, duration, ...props }) => (
        <Root className={`overflow-hidden h-100 ${className}`} {...props}>
            <div
                className={`d-inline-block max-w-100 max-h-100 ${style.scrollWrap}`}
                // @ts-expect-error remove after React 19 released
                style={{ '--duration': duration }}
            >
                <div className={`d-inline-block ${style.scrollItem}`}>{children}</div>
            </div>
        </Root>
    )
);
VerticalMarquee.displayName = 'VerticalMarquee';
