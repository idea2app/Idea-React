import classNames from 'classnames';
import { ComponentPropsWithRef, MouseEvent } from 'react';

import { polymorphic } from '../Helper/Polymorphic';

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
    variant?: 'solid' | 'outline' | 'subtle' | 'text' | 'link' | false;
    theme?: ComponentTheme;
    size?: 'xs' | 'sm' | 'lg';
    icon?: boolean;
    styled?: boolean;
    disabled?: boolean;
    active?: boolean;
}

type ButtonLinkAttributes = ComponentPropsWithRef<'a'> & { href: string };

type ButtonAttributes = ComponentPropsWithRef<'button'> & { href?: never };

type ButtonElementAttributes = ButtonAttributes | ButtonLinkAttributes;

export type ButtonProps = ButtonStyleProps & ButtonElementAttributes;

const isButtonLink = (props: ButtonElementAttributes): props is ButtonLinkAttributes =>
    typeof props.href === 'string';

const preventNavigation = (event: MouseEvent<HTMLElement>) => event.preventDefault();

export const Button = polymorphic<ButtonProps>(
    ({ as: RootAs, variant, theme, size, icon, styled, disabled, active, className, ...props }) => {
        const attributes: ButtonElementAttributes = props;
        const link = isButtonLink(attributes);
        const Root = RootAs ?? (link ? 'a' : 'button');
        const nativeButton = Root === 'button';
        const role = attributes.role ?? (link ? 'link' : 'button');
        const onClick =
            !nativeButton && disabled
                ? typeof Root === 'string'
                    ? undefined
                    : preventNavigation
                : attributes.onClick;
        const classes = classNames(
            variant === false ? undefined : variant ? `btn-${variant}` : icon ? undefined : 'btn',
            theme && `theme-${theme}`,
            size && `btn-${size}`,
            { 'btn-icon': icon, 'btn-styled': styled, disabled, active },
            className
        );

        return (
            <Root
                {...attributes}
                className={classes}
                role={role}
                type={nativeButton ? attributes.type || 'button' : attributes.type}
                href={disabled ? undefined : attributes.href}
                disabled={nativeButton || typeof Root !== 'string' ? disabled : undefined}
                aria-disabled={(!nativeButton && disabled) || undefined}
                aria-pressed={
                    !link || role === 'button'
                        ? (active ?? attributes['aria-pressed'])
                        : attributes['aria-pressed']
                }
                tabIndex={!nativeButton && disabled ? -1 : attributes.tabIndex}
                onClick={onClick}
            />
        );
    }
);
Button.displayName = 'Button';

export type ButtonInputProps = Omit<ComponentPropsWithRef<'input'>, 'size'> & ButtonStyleProps;

export const ButtonInput = polymorphic<ButtonInputProps>(
    ({
        as: Root = 'input',
        variant,
        theme,
        size,
        icon,
        styled,
        active,
        className,
        type = 'button',
        ...props
    }) => (
        <Root
            {...props}
            type={type}
            className={classNames(
                variant === false ? undefined : variant ? `btn-${variant}` : 'btn',
                theme && `theme-${theme}`,
                size && `btn-${size}`,
                { 'btn-icon': icon, 'btn-styled': styled, active },
                className
            )}
        />
    )
);
ButtonInput.displayName = 'ButtonInput';
