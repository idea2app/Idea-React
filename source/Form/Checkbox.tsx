'use client';

import classNames from 'classnames';
import { Component, ComponentPropsWithoutRef, forwardRef, Ref } from 'react';

import type { ComponentTheme } from '../Button';
import { FormValidationProps } from './Primitives';

export type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'> &
    FormValidationProps & {
        size?: 'sm' | 'lg';
        theme?: ComponentTheme;
        indeterminate?: boolean;
    };

interface CheckboxComponentProps extends CheckboxProps {
    forwardedRef?: Ref<HTMLInputElement>;
}

class CheckboxComponent extends Component<CheckboxComponentProps> {
    private input?: HTMLInputElement;

    componentDidMount() {
        this.setIndeterminate();
    }

    componentDidUpdate() {
        this.setIndeterminate();
    }

    private setIndeterminate = () => {
        if (this.input) this.input.indeterminate = this.props.indeterminate || false;
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
            size,
            theme,
            validation,
            indeterminate,
            forwardedRef: _forwardedRef,
            ...props
        } = this.props;

        return (
            <input
                {...props}
                ref={this.setInputRef}
                type="checkbox"
                aria-invalid={validation ? validation === 'invalid' : props['aria-invalid']}
                aria-checked={indeterminate ? 'mixed' : props['aria-checked']}
                className={classNames(
                    'check',
                    size && `check-${size}`,
                    theme && `theme-${theme}`,
                    validation && `is-${validation}`,
                    className
                )}
            />
        );
    }
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, forwardedRef) => (
    <CheckboxComponent {...props} forwardedRef={forwardedRef} />
));

Checkbox.displayName = 'Checkbox';
