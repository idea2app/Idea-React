'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export type DatePickerProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
    enhanced?: boolean;
    inline?: boolean;
    selectionMode?: 'single' | 'multiple' | 'multiple-ranged';
};

export const DatePicker: FC<DatePickerProps> = ({
    className,
    enhanced,
    inline,
    selectionMode,
    ...props
}) => (
    <input
        {...props}
        type={enhanced ? 'text' : 'date'}
        className={classNames('form-control', className)}
        data-bs-toggle={enhanced ? 'datepicker' : undefined}
        data-bs-inline={enhanced ? inline || undefined : undefined}
        data-bs-selection-mode={enhanced ? selectionMode : undefined}
    />
);

DatePicker.displayName = 'DatePicker';
