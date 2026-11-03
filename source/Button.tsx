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

const preventNavigation = (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault();

export const Button: FC<ButtonProps> = ({
    variant,
    theme,
    size,
    icon,
    styled,
    disabled,
    active,
    className,
    ...props
}) => {
    const attributes: ButtonElementAttributes = props;
    const classes = classNames(
        variant === false ? undefined : variant ? `btn-${variant}` : icon ? undefined : 'btn',
        theme && `theme-${theme}`,
        size && `btn-${size}`,
        { 'btn-icon': icon, 'btn-styled': styled, disabled, active },
        className
    );

    return isButtonLink(attributes) ? (
        <a
            {...attributes}
            className={classes}
            href={disabled ? undefined : attributes.href}
            aria-disabled={disabled || undefined}
            aria-pressed={
                attributes.role === 'button'
                    ? (active ?? attributes['aria-pressed'])
                    : attributes['aria-pressed']
            }
            tabIndex={disabled ? -1 : attributes.tabIndex}
            onClick={disabled ? preventNavigation : attributes.onClick}
        />
    ) : (
        <button
            {...attributes}
            type={attributes.type || 'button'}
            className={classes}
            disabled={disabled}
            aria-pressed={active ?? attributes['aria-pressed']}
        />
    );
};

export type ButtonInputProps = Omit<ComponentPropsWithRef<'input'>, 'size'> & ButtonStyleProps;

export const ButtonInput: FC<ButtonInputProps> = ({
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
    <input
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
);

Button.displayName = 'Button';
ButtonInput.displayName = 'ButtonInput';
