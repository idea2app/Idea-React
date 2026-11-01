'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, CSSProperties, FC, InputEvent } from 'react';

import type { ComponentTheme } from '../Button';

export type FormRangeProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
    bubble?: boolean;
    theme?: ComponentTheme;
};

export const FormRange: FC<FormRangeProps> = ({
    className,
    min = 0,
    max = 100,
    value,
    defaultValue,
    bubble,
    theme,
    onInput,
    style,
    ...props
}) => {
    const currentValue = Number(value ?? defaultValue ?? min);
    const fill =
        Number(max) <= Number(min)
            ? 0
            : Math.max(0, Math.min(1, (currentValue - Number(min)) / (Number(max) - Number(min))));

    const handleInput = (event: InputEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        const range = Number(input.value);
        const value =
            Number(max) <= Number(min)
                ? 0
                : Math.max(0, Math.min(1, (range - Number(min)) / (Number(max) - Number(min))));

        input.parentElement?.style.setProperty('--range-fill', value + '');

        onInput?.(event);
    };

    return (
        <div
            className={classNames('form-range', theme && `theme-${theme}`)}
            data-bs-bubble={bubble || undefined}
            style={{ '--range-fill': fill } as CSSProperties}
        >
            <input
                {...props}
                type="range"
                min={min}
                max={max}
                value={value}
                defaultValue={defaultValue}
                className={classNames('form-range-input', className)}
                style={style}
                onInput={handleInput}
            />
        </div>
    );
};

FormRange.displayName = 'FormRange';
