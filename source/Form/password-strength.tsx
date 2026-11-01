'use client';

import classNames from 'classnames';
import { Component, ComponentPropsWithoutRef, forwardRef, Ref } from 'react';

export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthProps extends ComponentPropsWithoutRef<'div'> {
    input?: string | HTMLInputElement | null;
    minLength?: number;
    messages?: Partial<Record<PasswordStrengthLevel, string>>;
    weights?: Record<string, number>;
    thresholds?: number[];
    scorer?: (password: string) => number;
    variant?: 'segments' | 'bar';
}

interface PasswordStrengthComponentProps extends PasswordStrengthProps {
    forwardedRef?: Ref<HTMLDivElement>;
}

interface StrengthInstance {
    dispose(): void;
    getStrength(): string | null;
}

const levels: PasswordStrengthLevel[] = ['weak', 'fair', 'good', 'strong'];

class PasswordStrengthComponent extends Component<PasswordStrengthComponentProps> {
    private meter?: HTMLDivElement;
    private instance?: StrengthInstance;
    private instanceElement?: HTMLDivElement;
    private passwordInput?: HTMLInputElement;
    private mounted = false;

    componentDidMount() {
        this.mounted = true;
        this.initialize();
    }

    componentDidUpdate(previousProps: PasswordStrengthProps) {
        if (
            previousProps.input !== this.props.input ||
            previousProps.minLength !== this.props.minLength ||
            previousProps.messages !== this.props.messages ||
            previousProps.weights !== this.props.weights ||
            previousProps.thresholds !== this.props.thresholds ||
            previousProps.scorer !== this.props.scorer ||
            previousProps.variant !== this.props.variant
        ) {
            this.dispose();
            this.initialize();
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.dispose();
    }

    private initialize = async () => {
        const element = this.meter;
        if (!element) return;

        const { input, minLength, messages, weights, thresholds, scorer } = this.props;
        const { default: Strength } = await import('bootstrap/js/src/strength.js');
        const config = {
            ...(input !== undefined && { input }),
            ...(minLength !== undefined && { minLength }),
            ...(messages !== undefined && {
                messages: { ...Strength.Default.messages, ...messages }
            }),
            ...(weights !== undefined && { weights }),
            ...(thresholds !== undefined && { thresholds }),
            ...(scorer !== undefined && { scorer })
        };

        if (!this.mounted || this.meter !== element) return;

        this.instanceElement = element;
        this.instance = Strength.getOrCreateInstance(element, config);
        this.passwordInput =
            typeof input === 'string'
                ? document.querySelector<HTMLInputElement>(input) || undefined
                : input ||
                  element.parentElement?.querySelector<HTMLInputElement>('input[type="password"]') ||
                  undefined;
        this.passwordInput?.addEventListener('input', this.handleInput);
        this.passwordInput?.addEventListener('change', this.handleInput);
        this.handleInput();
    };

    private handleInput = () => {
        const strength = this.instance?.getStrength();
        const levelIndex = strength ? levels.indexOf(strength as PasswordStrengthLevel) + 1 : 0;
        const element = this.instanceElement;

        element?.setAttribute('aria-valuenow', String(levelIndex));
        element?.setAttribute('aria-valuetext', strength || 'Empty');
    };
    private dispose = () => {
        this.passwordInput?.removeEventListener('input', this.handleInput);
        this.passwordInput?.removeEventListener('change', this.handleInput);
        this.instance?.dispose();
        this.instance = undefined;
        this.instanceElement = undefined;
        this.passwordInput = undefined;
    };

    private setMeterRef = (element: HTMLDivElement | null) => {
        this.meter = element || undefined;
        const { forwardedRef } = this.props;

        if (typeof forwardedRef === 'function') {
            forwardedRef(element);
        } else if (forwardedRef) {
            forwardedRef.current = element;
        }
    };

    render() {
        const {
            className,
            input: _input,
            minLength: _minLength,
            messages: _messages,
            weights: _weights,
            thresholds: _thresholds,
            scorer: _scorer,
            forwardedRef: _forwardedRef,
            variant = 'segments',
            ...props
        } = this.props;
        const isBar = variant === 'bar';

        return (
            <div
                {...props}
                ref={this.setMeterRef}
                className={classNames(isBar ? 'strength-bar' : 'strength', className)}
                role="meter"
                aria-valuemin={0}
                aria-valuemax={levels.length}
                aria-valuenow={0}
                aria-valuetext="Empty"
            >
                {!isBar && levels.map(level => <div key={level} className="strength-segment" />)}
                {!isBar && <span className="strength-text" />}
            </div>
        );
    }
}

export const PasswordStrength = forwardRef<HTMLDivElement, PasswordStrengthProps>(
    (props, forwardedRef) => <PasswordStrengthComponent {...props} forwardedRef={forwardedRef} />
);

PasswordStrength.displayName = 'PasswordStrength';
