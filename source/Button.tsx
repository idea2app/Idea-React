'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export type ComponentTheme =
    'primary' | 'accent' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'inverse';

interface ButtonStyleProps {
    variant?: 'solid' | 'outline' | 'subtle' | 'text';
    theme?: ComponentTheme;
    size?: 'sm' | 'lg';
    icon?: boolean;
    styled?: boolean;
    disabled?: boolean;
}

type ButtonLinkAttributes = ComponentPropsWithRef<'a'> & { href: string };
type ButtonAttributes = ComponentPropsWithRef<'button'> & { href?: never };
type ButtonElementAttributes = ButtonAttributes | ButtonLinkAttributes;
export type ButtonProps = ButtonStyleProps & ButtonElementAttributes;

function isButtonLink(props: ButtonElementAttributes): props is ButtonLinkAttributes {
    return typeof props.href === 'string';
}

export const Button: FC<ButtonProps> = ({
    variant,
    theme,
    size,
    icon,
    styled,
    disabled,
    className,
    ...props
}) => {
    const attributes: ButtonElementAttributes = props;
    const classes = classNames(
        variant ? `btn-${variant}` : 'btn',
        theme && `theme-${theme}`,
        size && `btn-${size}`,
        { 'btn-icon': icon, 'btn-styled': styled, disabled },
        className
    );

    if (isButtonLink(attributes)) {
        return (
            <a
                {...attributes}
                className={classes}
                href={disabled ? undefined : attributes.href}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : attributes.tabIndex}
                onClick={disabled ? event => event.preventDefault() : attributes.onClick}
            />
        );
    }

    return (
        <button
            {...attributes}
            type={attributes.type || 'button'}
            className={classes}
            disabled={disabled}
        />
    );
};
