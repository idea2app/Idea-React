'use client';

import type Range from 'bootstrap/js/src/range.js';
import classNames from 'classnames';
import { ComponentPropsWithoutRef, CSSProperties, forwardRef, Ref } from 'react';

import { ComponentTheme } from '../Button';
import { FormPlugin } from './Plugin';
import { FormValidationProps } from './Primitives';

export type FormRangeProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> &
    FormValidationProps & {
        bubble?: boolean;
        theme?: ComponentTheme;
        formatter?: (value: number) => string;
        wrapperClassName?: string;
        onValueChange?: (value: number) => unknown;
    };

interface FormRangeComponentProps extends FormRangeProps {
    forwardedRef?: Ref<HTMLInputElement>;
}

class FormRangeComponent extends FormPlugin<FormRangeComponentProps, Range> {
    protected configurationChanged = (previous: FormRangeComponentProps) =>
        previous.bubble !== this.props.bubble ||
        previous.formatter !== this.props.formatter ||
        previous.list !== this.props.list ||
        previous.min !== this.props.min ||
        previous.max !== this.props.max;

    protected load = async () => {
        const { default: Plugin } = await import('bootstrap/js/src/range.js');
        const { bubble = false, formatter = null } = this.props;

        return (element: HTMLDivElement) => {
            element.addEventListener('changed.bs.range', this.handleValueChange);

            return Plugin.getOrCreateInstance(element, { bubble, formatter });
        };
    };

    protected updatePlugin = () => this.instance?.update();

    protected dispose() {
        this.element.current?.removeEventListener('changed.bs.range', this.handleValueChange);
        super.dispose();
    }

    private handleValueChange = (event: Event) =>
        this.props.onValueChange?.((event as Event & { value: number }).value);

    render() {
        const {
            className,
            wrapperClassName,
            min = 0,
            max = 100,
            value,
            defaultValue,
            bubble,
            theme,
            formatter: _formatter,
            onValueChange: _onValueChange,
            forwardedRef,
            validation,
            style,
            ...props
        } = this.props;
        const currentValue = Number(value ?? defaultValue ?? (Number(min) + Number(max)) / 2);
        const fill =
            Number(max) <= Number(min)
                ? 0
                : Math.max(
                      0,
                      Math.min(1, (currentValue - Number(min)) / (Number(max) - Number(min)))
                  );

        return (
            <div
                ref={this.element}
                className={classNames(
                    'form-range',
                    theme && `theme-${theme}`,
                    validation && `is-${validation}`,
                    wrapperClassName
                )}
                data-bs-bubble={bubble || undefined}
                style={{ '--bs-range-fill': fill } as CSSProperties}
            >
                <input
                    {...props}
                    ref={forwardedRef}
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    defaultValue={defaultValue}
                    aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
                    className={classNames('form-range-input', className)}
                    style={style}
                />
            </div>
        );
    }
}

export const FormRange = forwardRef<HTMLInputElement, FormRangeProps>((props, forwardedRef) => (
    <FormRangeComponent {...props} forwardedRef={forwardedRef} />
));

FormRange.displayName = 'FormRange';
