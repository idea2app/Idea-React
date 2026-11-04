'use client';

import type Range from 'bootstrap/js/src/range.js';
import classNames from 'classnames';
import { ComponentPropsWithoutRef, CSSProperties, forwardRef, Ref } from 'react';

import { ComponentTheme } from '../Button';
import { AsProps, polymorphic } from '../Polymorphic';
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

interface FormRangeComponentProps extends FormRangeProps, AsProps {
    forwardedRef?: Ref<HTMLElement>;
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

    private forwardRef = (element: HTMLElement | null) => {
        const { forwardedRef } = this.props;

        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
    };

    private setRootRef = (element: HTMLDivElement | null) => {
        this.element.current = element;

        if (this.props.as) this.forwardRef(element);
    };

    render() {
        const {
            as: Root = 'div',
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
            forwardedRef: _forwardedRef,
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
            <Root
                {...(this.props.as ? props : {})}
                ref={this.setRootRef}
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
                    {...(this.props.as ? {} : props)}
                    ref={this.props.as ? undefined : this.forwardRef}
                    name={props.name}
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    defaultValue={defaultValue}
                    aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
                    className={classNames(
                        'form-range-input',
                        validation && `is-${validation}`,
                        className
                    )}
                    style={style}
                />
            </Root>
        );
    }
}

export const FormRange = polymorphic<FormRangeProps & { ref?: Ref<HTMLInputElement> }>(
    forwardRef<HTMLInputElement, FormRangeProps & AsProps>((props, forwardedRef) => (
        <FormRangeComponent {...props} forwardedRef={forwardedRef} />
    ))
);
FormRange.displayName = 'FormRange';
