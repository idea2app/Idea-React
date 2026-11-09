import classNames from 'classnames';
import { ComponentPropsWithRef, CSSProperties } from 'react';

import { polymorphic } from '../Helper/Polymorphic';

export type AspectRatio = 'auto' | '1x1' | '4x3' | '16x9' | '21x9';
export type CustomAspectRatio = `${number} / ${number}`;

export type RatioProps = ComponentPropsWithRef<'div'> & {
    aspectRatio?: AspectRatio | CustomAspectRatio;
};

export const Ratio = polymorphic<RatioProps>(
    ({ as: Root = 'div', aspectRatio = '1x1', className, style, ...props }) => {
        const preset = /^(auto|1x1|4x3|16x9|21x9)$/.test(aspectRatio);
        const ratioStyle: CSSProperties & { '--bs-ratio'?: string } = preset
            ? (style ?? {})
            : { ...style, '--bs-ratio': aspectRatio };

        return (
            <Root
                {...props}
                style={ratioStyle}
                className={classNames(`ratio-${preset ? aspectRatio : 'auto'}`, className)}
            />
        );
    }
);
Ratio.displayName = 'Ratio';
