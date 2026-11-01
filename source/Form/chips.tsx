'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import type { ComponentTheme } from '../Button';

export type ChipProps = ComponentPropsWithRef<'button'> & {
    active?: boolean;
    theme?: ComponentTheme;
};

export const Chip: FC<ChipProps> = ({ className, active, disabled, theme, ...props }) => (
    <button
        {...props}
        className={classNames('chip', active && 'active', theme && `theme-${theme}`, className)}
        type="button"
        aria-pressed={active}
        disabled={disabled}
    />
);

Chip.displayName = 'Chip';

export type ChipInputProps = ComponentPropsWithRef<'div'> & {
    theme?: ComponentTheme;
    separator?: string;
    allowDuplicates?: boolean;
    maxChips?: number;
    createOnBlur?: boolean;
};

export const ChipInput: FC<ChipInputProps> = ({
    className,
    theme,
    separator,
    allowDuplicates,
    maxChips,
    createOnBlur,
    ...props
}) => (
    <div
        {...props}
        className={classNames('chip-input', theme && `theme-${theme}`, className)}
        data-bs-chips=""
        data-bs-separator={separator}
        data-bs-allow-duplicates={allowDuplicates}
        data-bs-max-chips={maxChips}
        data-bs-create-on-blur={createOnBlur}
    />
);

ChipInput.displayName = 'ChipInput';
