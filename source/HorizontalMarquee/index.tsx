import { FC, PropsWithChildren } from 'react';

import * as style from './index.module.less';

export type HorizontalMarqueeProps = PropsWithChildren<
    Partial<Record<'maxWidth' | 'duration' | 'height', string>>
>;

export const HorizontalMarquee: FC<HorizontalMarqueeProps> = ({
    children,
    maxWidth = '100%',
    duration,
    height
}) => (
    <div className="overflow-hidden mw-100">
        <div
            className={`d-inline-block align-top text-nowrap ${style.scrollWrap}`}
            style={{
                maxWidth,
                animationDuration: duration,
                height,
                lineHeight: height
            }}
        >
            <div
                className={`d-inline-block ${style.scrollItem}`}
                style={{ animationDuration: duration }}
            >
                {children}
            </div>
        </div>
    </div>
);

export const HorizontalMarqueeBox: FC<HorizontalMarqueeProps> = ({
    children,
    maxWidth,
    duration,
    height
}) =>
    height ? (
        <div
            className={`overflow-hidden ${style.scrollHeightWrap}`}
            // @ts-expect-error remove after React 19 released
            style={{ maxWidth: maxWidth, '--scroll-height': height }}
        >
            <div
                className={`d-inline-block overflow-hidden mw-100 ${style.scrollContainer}`}
            >
                <div
                    className={`d-block overflow-hidden text-wrap text-break ${style.unScrollItem}`}
                >
                    {children}
                </div>
                <HorizontalMarquee duration={duration}>
                    {children}
                </HorizontalMarquee>
            </div>
        </div>
    ) : (
        <HorizontalMarquee {...{ maxWidth, duration, height }}>
            {children}
        </HorizontalMarquee>
    );
