import { FC, HTMLAttributes } from 'react';

import * as style from './index.module.less';

export interface VerticalMarqueeProps extends HTMLAttributes<HTMLDivElement> {
    duration?: string;
}

export const VerticalMarquee: FC<VerticalMarqueeProps> = ({
    className = '',
    children,
    duration,
    ...props
}) => (
    <div className={`overflow-hidden ${className}`} {...props}>
        <div
            className={`d-inline-block mw-100 mh-100 ${style.scrollWrap}`}
            // @ts-expect-error remove after React 19 released
            style={{ '--duration': duration }}
        >
            <div className={`d-inline-block ${style.scrollItem}`}>
                {children}
            </div>
        </div>
    </div>
);
VerticalMarquee.displayName = 'VerticalMarquee';
