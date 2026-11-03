import { HTMLAttributes } from 'react';

import { polymorphic } from '../../Polymorphic';
import * as style from './index.module.less';

export type HorizontalMarqueeProps = HTMLAttributes<HTMLDivElement> &
    Partial<Record<'maxWidth' | 'duration' | 'height', string>>;

export const HorizontalMarquee = polymorphic<HorizontalMarqueeProps>(
    ({
        as: Root = 'div',
        className = '',
        children,
        maxWidth = '100%',
        duration,
        height,
        ...props
    }) => (
        <Root className={`overflow-hidden max-w-100 ${className}`} {...props}>
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
        </Root>
    )
);

export const HorizontalMarqueeBox = polymorphic<HorizontalMarqueeProps>(
    ({
        as: RootAs,
        children,
        className = '',
        style: rootStyle,
        maxWidth,
        duration,
        height,
        ...props
    }) => {
        const Root = RootAs ?? 'div';
        return height ? (
            <Root
                {...props}
                className={`overflow-hidden ${style.scrollHeightWrap} ${className}`}
                style={{ maxWidth, '--scroll-height': height, ...rootStyle }}
            >
                <div
                    className={`d-inline-block overflow-hidden max-w-100 ${style.scrollContainer}`}
                >
                    <div
                        className={`d-block overflow-hidden text-wrap text-break ${style.unScrollItem}`}
                    >
                        {children}
                    </div>
                    <HorizontalMarquee duration={duration}>{children}</HorizontalMarquee>
                </div>
            </Root>
        ) : (
            <HorizontalMarquee
                as={RootAs}
                {...props}
                className={className}
                style={rootStyle}
                {...{ maxWidth, duration, height }}
            >
                {children}
            </HorizontalMarquee>
        );
    }
);

HorizontalMarquee.displayName = 'HorizontalMarquee';

HorizontalMarqueeBox.displayName = 'HorizontalMarqueeBox';
