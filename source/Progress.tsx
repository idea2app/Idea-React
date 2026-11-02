'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, createContext, FC, useContext } from 'react';

import { ComponentTheme } from './Button';

const StackedProgress = createContext(false);

export interface ProgressProps extends ComponentPropsWithRef<'div'> {
    value: number;
    min?: number;
    max?: number;
    theme?: ComponentTheme;
    striped?: boolean;
    animated?: boolean;
    barProps?: ComponentPropsWithRef<'div'>;
}

export const Progress: FC<ProgressProps> = ({
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

    const stacked = useContext(StackedProgress);
    const current = Math.min(max, Math.max(min, value));
    const width = `${((current - min) / (max - min)) * 100}%`;
    const { className: barClass, style: barStyle, ...barAttributes } = barProps;

    return (
        <div
            {...props}
            className={classNames('progress', className)}
            style={{ width: stacked ? width : undefined, ...style }}
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
                style={{ width: stacked ? undefined : width, ...barStyle }}
            >
                {children}
            </div>
        </div>
    );
};

export const ProgressStack: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <StackedProgress.Provider value>
        <div {...props} className={classNames('progress-stacked', className)} />
    </StackedProgress.Provider>
);

Progress.displayName = 'Progress';
ProgressStack.displayName = 'ProgressStack';
