'use client';

import classNames from 'classnames';
import { ButtonHTMLAttributes, Component, ElementType, KeyboardEvent, MouseEvent } from 'react';

import { AsProps, PolymorphicClassProps } from '../Helper/Polymorphic';
import { Button, ComponentTheme } from './Button';

export interface TogglerProps extends Omit<ButtonHTMLAttributes<HTMLElement>, 'value'> {
    as?: 'button' | 'div' | 'span';
    target?: string;
    attribute?: string;
    value?: string | number | boolean | null;
    theme?: ComponentTheme;
    variant?: 'solid' | 'outline' | 'subtle' | 'text' | 'link';
    onToggled?: (targets: HTMLElement[]) => unknown;
}

export class Toggler<T extends ElementType | undefined = 'button'> extends Component<
    PolymorphicClassProps<T, TogglerProps>
> {
    static displayName = 'Toggler';

    declare readonly props: PolymorphicClassProps<T, TogglerProps>;

    protected get componentProps(): Readonly<Omit<TogglerProps, 'as'> & AsProps> {
        return this.props;
    }

    handleClick = (event: MouseEvent<HTMLElement>) => {
        this.componentProps.onClick?.(event);

        if (event.defaultPrevented || this.componentProps.disabled) return;

        const { target, attribute = 'class', value, onToggled } = this.componentProps;
        const targets = target
            ? [...document.querySelectorAll<HTMLElement>(target)]
            : [event.currentTarget];
        const changes = targets.map(element => ({
            element,
            attribute: element.dataset.bsAttribute ?? attribute,
            value: element.dataset.bsValue ?? value
        }));

        if (changes.some(({ attribute }) => attribute.toLowerCase() === 'id'))
            throw new TypeError('Toggler cannot change the id attribute');

        for (const { element, attribute, value } of changes) {
            if (value == null) continue;

            const text = String(value);
            const before = new window.CustomEvent('toggle.bs.toggler', { cancelable: true });

            if (!element.dispatchEvent(before)) continue;

            if (attribute === 'class') {
                for (const name of text.split(/\s+/).filter(Boolean))
                    element.classList.toggle(name);
            } else if (element.getAttribute(attribute) === text) element.removeAttribute(attribute);
            else element.setAttribute(attribute, text);

            element.dispatchEvent(new window.CustomEvent('toggled.bs.toggler'));
        }
        onToggled?.(targets);
    };

    handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        this.componentProps.onKeyDown?.(event);

        if (
            !event.defaultPrevented &&
            !this.componentProps.disabled &&
            (event.key === 'Enter' || event.key === ' ')
        ) {
            event.preventDefault();
            event.currentTarget.click();
        }
    };

    render() {
        const {
            as: Tag = 'button',
            target: _target,
            attribute: _attribute,
            value: _value,
            onToggled: _onToggled,
            theme,
            variant,
            disabled,
            ...props
        } = this.componentProps;

        return Tag === 'button' ? (
            <Button
                {...props}
                theme={theme}
                variant={variant}
                disabled={disabled}
                onClick={this.handleClick}
            />
        ) : (
            <Tag
                {...props}
                className={classNames(
                    theme && `theme-${theme}`,
                    variant && `btn-${variant}`,
                    props.className
                )}
                role={props.role ?? 'button'}
                tabIndex={disabled ? -1 : (props.tabIndex ?? 0)}
                aria-disabled={disabled || undefined}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
            />
        );
    }
}
