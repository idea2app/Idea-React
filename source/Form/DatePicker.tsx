'use client';

import Datepicker, { type DatepickerConfig } from 'bootstrap/js/src/datepicker.js';
import classNames from 'classnames';
import { ComponentPropsWithoutRef, forwardRef, Ref } from 'react';

import { Button, ButtonProps } from '../Base/Button';
import { Icon } from '../Extension/Icon';
import { AsProps, polymorphic, PolymorphicComponent } from '../Helper/Polymorphic';
import { FormPlugin } from './Plugin';
import { FormValidationProps } from './Primitives';

export type DatePickerOptions = Partial<DatepickerConfig>;

interface DatePickerSettings {
    options?: DatePickerOptions;
    inline?: boolean;
    selectionMode?: DatepickerConfig['selectionMode'];
    displayMonthsCount?: DatepickerConfig['displayMonthsCount'];
    selectedDates?: string[];
    firstWeekday?: DatepickerConfig['firstWeekday'];
    placement?: DatepickerConfig['placement'];
    datepickerTheme?: string;
    onDatesChange?: (dates: string[]) => unknown;
}

export type DatePickerProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> &
    DatePickerSettings &
    FormValidationProps & {
        enhanced?: boolean;
        ghost?: boolean;
        controlSize?: 'sm' | 'lg';
    };

export type DatePickerButtonProps = Extract<ButtonProps, { href?: never }> &
    DatePickerSettings & {
        leadingIcon?: string;
    };
export type DatePickerInlineProps = ComponentPropsWithoutRef<'div'> & DatePickerSettings;

interface DatePickerComponentProps extends DatePickerProps, AsProps {
    kind?: 'input' | 'button' | 'div';
    hostProps?: DatePickerButtonProps | DatePickerInlineProps;
    leadingIcon?: string;
    forwardedRef?: Ref<HTMLElement>;
}

class DatePickerComponent extends FormPlugin<
    DatePickerComponentProps,
    Pick<Datepicker, 'dispose'>,
    HTMLElement
> {
    protected configurationChanged = (previous: DatePickerComponentProps) =>
        previous.options !== this.props.options ||
        previous.enhanced !== this.props.enhanced ||
        previous.inline !== this.props.inline ||
        previous.selectionMode !== this.props.selectionMode ||
        previous.displayMonthsCount !== this.props.displayMonthsCount ||
        previous.firstWeekday !== this.props.firstWeekday ||
        previous.placement !== this.props.placement ||
        previous.datepickerTheme !== this.props.datepickerTheme ||
        previous.min !== this.props.min ||
        previous.max !== this.props.max ||
        JSON.stringify(previous.selectedDates) !== JSON.stringify(this.props.selectedDates);

    protected load = async () => {
        const { enhanced, kind = 'input' } = this.props;
        if (!enhanced && kind === 'input') return () => ({ dispose: () => undefined });

        const { ReactDatepicker } = await import('./DatePickerPlugin');
        const {
            options,
            inline,
            selectionMode,
            min,
            max,
            displayMonthsCount,
            selectedDates,
            firstWeekday,
            placement,
            datepickerTheme
        } = this.props;
        const config: DatePickerOptions = {
            ...options,
            ...(inline !== undefined && { inline }),
            ...(selectionMode !== undefined && { selectionMode }),
            ...(min !== undefined && { dateMin: String(min) as DatepickerConfig['dateMin'] }),
            ...(max !== undefined && { dateMax: String(max) as DatepickerConfig['dateMax'] }),
            ...(displayMonthsCount !== undefined && { displayMonthsCount }),
            ...(selectedDates !== undefined && { selectedDates }),
            ...(firstWeekday !== undefined && { firstWeekday }),
            ...(placement !== undefined && { placement }),
            ...(datepickerTheme !== undefined && { datepickerTheme })
        };

        return (element: HTMLElement) => {
            const children = [...element.childNodes];
            const instance = ReactDatepicker.getOrCreateInstance(element, config);
            element.addEventListener('change.bs.datepicker', this.handleDatesChange);

            return {
                dispose: () => {
                    element.removeEventListener('change.bs.datepicker', this.handleDatesChange);
                    instance.dispose();
                    if (this.props.kind === 'div') element.replaceChildren(...children);
                }
            };
        };
    };

    private handleDatesChange = (event: Event) =>
        this.props.onDatesChange?.((event as Event & { dates: string[] }).dates);

    private setRef = (element: HTMLElement | null) => {
        this.element.current = element;
        const { forwardedRef } = this.props;

        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
    };

    render() {
        const {
            as,
            className,
            enhanced,
            inline,
            selectionMode,
            min,
            max,
            options: _options,
            displayMonthsCount,
            selectedDates,
            firstWeekday,
            placement,
            datepickerTheme,
            onDatesChange: _onDatesChange,
            ghost,
            controlSize,
            validation,
            kind = 'input',
            hostProps,
            leadingIcon,
            forwardedRef: _forwardedRef,
            ...props
        } = this.props;
        const Root = as ?? (kind === 'div' ? 'div' : 'input');
        const attributes = {
            'data-bs-toggle': enhanced || kind !== 'input' ? 'datepicker' : undefined,
            'data-bs-inline': inline || kind === 'div' || undefined,
            'data-bs-selection-mode': selectionMode,
            'data-bs-display-months-count': displayMonthsCount,
            'data-bs-selected-dates': selectedDates ? JSON.stringify(selectedDates) : undefined,
            'data-bs-first-weekday': firstWeekday,
            'data-bs-placement': placement,
            'data-bs-datepicker-theme': datepickerTheme,
            'data-bs-date-min': enhanced ? min : undefined,
            'data-bs-date-max': enhanced ? max : undefined
        };

        if (kind === 'button') {
            const { children, ...buttonProps } = hostProps as ButtonProps;

            return (
                <Button as={as} {...buttonProps} {...attributes} ref={this.setRef}>
                    {leadingIcon && <Icon name={leadingIcon} />}
                    <span data-bs-datepicker-display="">{children}</span>
                </Button>
            );
        }
        if (kind === 'div')
            return (
                <Root
                    {...(hostProps as ComponentPropsWithoutRef<'div'>)}
                    {...attributes}
                    ref={this.setRef}
                />
            );

        return (
            <Root
                {...props}
                {...attributes}
                ref={this.setRef}
                className={classNames(
                    ghost ? 'form-ghost' : 'form-control',
                    controlSize && `form-control-${controlSize}`,
                    validation && `is-${validation}`,
                    className
                )}
                aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
                type={enhanced ? 'text' : 'date'}
                min={min}
                max={max}
            />
        );
    }
}

export const DatePicker = polymorphic<DatePickerProps & { ref?: Ref<HTMLInputElement> }>(
    forwardRef<HTMLInputElement, DatePickerProps & AsProps>((props, forwardedRef) => (
        <DatePickerComponent {...props} forwardedRef={forwardedRef} />
    ))
);
DatePicker.displayName = 'DatePicker';

export const DatePickerButton: PolymorphicComponent<
    DatePickerButtonProps & { ref?: Ref<HTMLButtonElement> }
> = polymorphic(
    forwardRef<HTMLButtonElement, DatePickerButtonProps & AsProps>(
        (
            {
                as,
                options,
                inline,
                selectionMode,
                displayMonthsCount,
                selectedDates,
                firstWeekday,
                placement,
                datepickerTheme,
                onDatesChange,
                leadingIcon,
                ...hostProps
            },
            forwardedRef
        ) => (
            <DatePickerComponent
                as={as}
                kind="button"
                leadingIcon={leadingIcon}
                hostProps={hostProps}
                forwardedRef={forwardedRef}
                {...{
                    options,
                    inline,
                    selectionMode,
                    displayMonthsCount,
                    selectedDates,
                    firstWeekday,
                    placement,
                    datepickerTheme,
                    onDatesChange
                }}
            />
        )
    )
);
DatePickerButton.displayName = 'DatePickerButton';

export const DatePickerInline = polymorphic<DatePickerInlineProps & { ref?: Ref<HTMLDivElement> }>(
    forwardRef<HTMLDivElement, DatePickerInlineProps & AsProps>(
        (
            {
                as,
                options,
                selectionMode,
                displayMonthsCount,
                selectedDates,
                firstWeekday,
                placement,
                datepickerTheme,
                onDatesChange,
                inline = true,
                ...hostProps
            },
            forwardedRef
        ) => (
            <DatePickerComponent
                as={as}
                kind="div"
                hostProps={hostProps}
                forwardedRef={forwardedRef}
                {...{
                    options,
                    inline,
                    selectionMode,
                    displayMonthsCount,
                    selectedDates,
                    firstWeekday,
                    placement,
                    datepickerTheme,
                    onDatesChange
                }}
            />
        )
    )
);
DatePickerInline.displayName = 'DatePickerInline';
