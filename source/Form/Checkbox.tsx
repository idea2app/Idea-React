'use client';

import classNames from 'classnames';
import { Component, ComponentPropsWithoutRef, forwardRef, Ref } from 'react';

import type { ComponentTheme } from '../Button';

export type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'> & {
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
            indeterminate,
            forwardedRef: _forwardedRef,
            ...props
        } = this.props;

        return (
            <input
                {...props}
                ref={this.setInputRef}
                type="checkbox"
                aria-checked={indeterminate ? 'mixed' : undefined}
                className={classNames(
                    'check',
                    size && `check-${size}`,
                    theme && `theme-${theme}`,
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
