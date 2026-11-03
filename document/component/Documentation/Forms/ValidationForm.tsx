'use client';

import { Component, InputEvent, SubmitEvent } from 'react';

import { Form, FormProps } from '../../../../source/Form';

export class ValidationForm extends Component<FormProps> {
    static displayName = 'ValidationForm';

    updateValidity = (control: Element) => {
        if (
            (control instanceof HTMLInputElement ||
                control instanceof HTMLSelectElement ||
                control instanceof HTMLTextAreaElement) &&
            control.willValidate
        )
            control.setAttribute('aria-invalid', String(!control.validity.valid));
    };

    handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        this.props.onSubmit?.(event);

        event.preventDefault();

        const { currentTarget } = event;

        if (!currentTarget.checkValidity()) event.stopPropagation();

        [...currentTarget.elements].forEach(this.updateValidity);
    };

    handleInput = (event: InputEvent<HTMLFormElement>) => {
        this.props.onInput?.(event);

        const { target } = event;

        if (target instanceof Element && target.hasAttribute('aria-invalid'))
            this.updateValidity(target);
    };

    render() {
        return <Form {...this.props} onSubmit={this.handleSubmit} onInput={this.handleInput} />;
    }
}
