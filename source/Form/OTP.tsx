'use client';

import type OtpInput from 'bootstrap/js/src/otp-input.js';
import classNames from 'classnames';
import { ComponentPropsWithoutRef, forwardRef, Ref } from 'react';

import { FormPlugin } from './Plugin';
import { FormValidationProps } from './Primitives';

export type OTPInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'maxLength' | 'size'> &
    FormValidationProps & {
        length: number;
        type?: 'numeric' | 'alphanumeric' | 'alpha';
        mask?: boolean;
        groups?: number[];
        separator?: string;
        connected?: boolean;
        size?: 'sm' | 'lg';
        wrapperClassName?: string;
        onComplete?: (value: string) => unknown;
        onValueChange?: (value: string) => unknown;
    };

interface OTPInputComponentProps extends OTPInputProps {
    forwardedRef?: Ref<HTMLInputElement>;
}

class OTPInputComponent extends FormPlugin<OTPInputComponentProps, OtpInput> {
    protected configurationChanged = (previous: OTPInputComponentProps) =>
        previous.length !== this.props.length ||
        previous.type !== this.props.type ||
        previous.mask !== this.props.mask ||
        previous.separator !== this.props.separator ||
        JSON.stringify(previous.groups) !== JSON.stringify(this.props.groups);

    protected load = async () => {
        const { default: Plugin } = await import('bootstrap/js/src/otp-input.js');
        const {
            length,
            type = 'numeric',
            mask = false,
            groups = null,
            separator = '·'
        } = this.props;

        return (element: HTMLDivElement) => {
            element.addEventListener('complete.bs.otpInput', this.handleComplete);
            element.addEventListener('input.bs.otpInput', this.handleValueChange);

            return Plugin.getOrCreateInstance(element, { length, type, mask, groups, separator });
        };
    };

    protected updatePlugin() {
        const { value } = this.props;
        const slots = this.element.current?.querySelector('.otp-slots');

        slots?.classList.add('min-w-0', 'max-w-100');

        for (const slot of slots?.querySelectorAll('.otp-slot') ?? [])
            slot.classList.add('min-w-0');

        if (value !== undefined && this.instance?.getValue() !== String(value))
            this.instance?.setValue(String(value));
    }

    protected dispose() {
        this.element.current?.removeEventListener('complete.bs.otpInput', this.handleComplete);
        this.element.current?.removeEventListener('input.bs.otpInput', this.handleValueChange);
        super.dispose();
    }

    private handleComplete = (event: Event) =>
        this.props.onComplete?.((event as Event & { value: string }).value);

    private handleValueChange = (event: Event) =>
        this.props.onValueChange?.((event as Event & { value: string }).value);

    render() {
        const {
            className,
            wrapperClassName,
            length,
            type = 'numeric',
            mask,
            groups,
            separator,
            connected,
            size,
            validation,
            onComplete: _onComplete,
            onValueChange: _onValueChange,
            forwardedRef,
            autoComplete = 'one-time-code',
            ...props
        } = this.props;

        return (
            <div
                ref={this.element}
                className={classNames(
                    'otp min-w-0 max-w-100',
                    connected && 'otp-connected',
                    size && `otp-${size}`,
                    validation && `is-${validation}`,
                    wrapperClassName
                )}
                data-bs-otp=""
                data-bs-length={length}
                data-bs-type={type}
                data-bs-mask={mask || undefined}
                data-bs-groups={groups ? JSON.stringify(groups) : undefined}
                data-bs-separator={separator}
            >
                <input
                    {...props}
                    ref={forwardedRef}
                    type="text"
                    maxLength={length}
                    autoComplete={autoComplete}
                    inputMode={type === 'numeric' ? 'numeric' : 'text'}
                    aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
                    pattern={
                        type === 'numeric'
                            ? '[0-9]*'
                            : type === 'alpha'
                              ? '[A-Za-z]*'
                              : '[A-Za-z0-9]*'
                    }
                    className={classNames('otp-input', className)}
                />
            </div>
        );
    }
}

export const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>((props, forwardedRef) => (
    <OTPInputComponent {...props} forwardedRef={forwardedRef} />
));

OTPInput.displayName = 'OTPInput';
