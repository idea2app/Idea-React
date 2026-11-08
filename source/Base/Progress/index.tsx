import classNames from 'classnames';
import { ComponentPropsWithRef, CSSProperties } from 'react';

import { polymorphic } from '../../Helper/Polymorphic';
import { ComponentTheme } from '../Button';

export interface ProgressProps extends ComponentPropsWithRef<'div'> {
    value: number;
    min?: number;
    max?: number;
    theme?: ComponentTheme;
    striped?: boolean;
    animated?: boolean;
    barProps?: ComponentPropsWithRef<'div'>;
}

export const Progress = polymorphic<ProgressProps>(
    ({
        as: Root = 'div',
        value,
        min = 0,
        max = 100,
        theme,
        striped,
        animated,
        barProps = {},
        className,
        style,
        children,
        ...props
    }) => {
        if (![value, min, max].every(Number.isFinite) || max <= min)
            throw new RangeError('Progress requires finite values and max greater than min');

        const current = Math.min(max, Math.max(min, value));
        const width = `${((current - min) / (max - min)) * 100}%`;
        // Stacks set the offset to zero and fill each segment's inner bar.
        const progressStyle: CSSProperties & { '--_progress-width': string } = {
            width: 'min(100%, calc(var(--_progress-width) + var(--_progress-stack-offset, 100%)))',
            ...style,
            '--_progress-width': width
        };
        const { className: barClass, style: barStyle, ...barAttributes } = barProps;

        return (
            <Root
                {...props}
                className={classNames('progress', className)}
                style={progressStyle}
                role="progressbar"
                aria-valuenow={current}
                aria-valuemin={min}
                aria-valuemax={max}
            >
                <div
                    {...barAttributes}
                    className={classNames(
                        'progress-bar',
                        theme && `theme-${theme}`,
                        {
                            'progress-bar-striped': striped || animated,
                            'progress-bar-animated': animated
                        },
                        barClass
                    )}
                    style={{ width: `var(--_progress-bar-width, ${width})`, ...barStyle }}
                >
                    {children}
                </div>
            </Root>
        );
    }
);
Progress.displayName = 'Progress';

export const ProgressStack = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, style, ...props }) => (
        <Root
            {...props}
            className={classNames('progress-stacked', className)}
            style={
                {
                    '--_progress-stack-offset': '0%',
                    '--_progress-bar-width': '100%',
                    ...style
                } as CSSProperties
            }
        />
    )
);
ProgressStack.displayName = 'ProgressStack';
