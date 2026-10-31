'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC, MouseEvent } from 'react';

export type ComponentTheme =
    | 'primary'
    | 'accent'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | 'inverse';

interface ButtonStyleProps {
    variant?: 'solid' | 'outline' | 'subtle' | 'text' | 'link';
    theme?: ComponentTheme;
    size?: 'xs' | 'sm' | 'lg';
    icon?: boolean;
    styled?: boolean;
    disabled?: boolean;
}

type ButtonLinkAttributes = ComponentPropsWithRef<'a'> & { href: string };
type ButtonAttributes = ComponentPropsWithRef<'button'> & { href?: never };
type ButtonElementAttributes = ButtonAttributes | ButtonLinkAttributes;
export type ButtonProps = ButtonStyleProps & ButtonElementAttributes;

const isButtonLink = (props: ButtonElementAttributes): props is ButtonLinkAttributes =>
    typeof props.href === 'string';

const preventNavigation = (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault();

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
        variant ? `btn-${variant}` : icon ? undefined : 'btn',
        theme && `theme-${theme}`,
        size && `btn-${size}`,
        { 'btn-icon': icon, 'btn-styled': styled, disabled },
        className
    );

    return isButtonLink(attributes) ? (
        <a
            {...attributes}
            className={classes}
            href={disabled ? undefined : attributes.href}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : attributes.tabIndex}
            onClick={disabled ? preventNavigation : attributes.onClick}
        />
    ) : (
        <button
            {...attributes}
            type={attributes.type || 'button'}
            className={classes}
            disabled={disabled}
        />
    );
};
