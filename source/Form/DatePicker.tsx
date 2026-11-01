'use client';

import classNames from 'classnames';
import { Component, ComponentPropsWithoutRef, forwardRef, Ref } from 'react';

export type DatePickerProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
    enhanced?: boolean;
    inline?: boolean;
    selectionMode?: 'single' | 'multiple' | 'multiple-ranged';
};

interface DatePickerComponentProps extends DatePickerProps {
    forwardedRef?: Ref<HTMLInputElement>;
}

interface DatepickerInstance {
    dispose(): void;
}

class DatePickerComponent extends Component<DatePickerComponentProps> {
    private input?: HTMLInputElement;
    private instance?: DatepickerInstance;
    private mounted = false;

    componentDidMount() {
        this.mounted = true;
        this.initialize();
    }

    componentWillUnmount() {
        this.mounted = false;
        const { instance } = this;
        this.instance = undefined;

        queueMicrotask(() => instance?.dispose());
    }

    private initialize = async () => {
        if (!this.props.enhanced) return;

        const { default: Datepicker } = await import('bootstrap/js/src/datepicker.js');

        if (this.mounted && this.input) this.instance = Datepicker.getOrCreateInstance(this.input);
    };

    private setInputRef = (input: HTMLInputElement | null) => {
        this.input = input || undefined;

        const { forwardedRef } = this.props;

        if (typeof forwardedRef === 'function') forwardedRef(input);
        else if (forwardedRef) forwardedRef.current = input;
    };

    render() {
        const {
            className,
            enhanced,
            inline,
            selectionMode,
            min,
            max,
            forwardedRef: _forwardedRef,
            ...props
        } = this.props;

        return (
            <input
                {...props}
                ref={this.setInputRef}
                className={classNames('form-control', className)}
                type={enhanced ? 'text' : 'date'}
                min={min}
                max={max}
                data-bs-toggle={enhanced ? 'datepicker' : undefined}
                data-bs-date-min={enhanced ? min : undefined}
                data-bs-date-max={enhanced ? max : undefined}
                data-bs-inline={enhanced ? inline || undefined : undefined}
                data-bs-selection-mode={enhanced ? selectionMode : undefined}
            />
        );
    }
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((props, forwardedRef) => (
    <DatePickerComponent {...props} forwardedRef={forwardedRef} />
));

DatePicker.displayName = 'DatePicker';
