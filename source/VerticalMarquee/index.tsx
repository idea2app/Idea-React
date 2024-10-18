import { FC, PropsWithChildren } from 'react';

import * as style from './index.module.less';

export type VerticalMarqueeProps = PropsWithChildren<{ duration?: string }>;

export const VerticalMarquee: FC<VerticalMarqueeProps> = ({
    children,
    duration
}) => (
    <div
        className={`d-inline-block mh-100 ${style.scrollWrap}`}
        // @ts-expect-error remove after React 19 released
        style={{ '--duration': duration }}
    >
        <div className={`d-inline-block ${style.scrollItem}`}>{children}</div>
    </div>
);
