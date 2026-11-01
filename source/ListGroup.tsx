import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import type { ComponentTheme } from './Button';
import type { Breakpoint } from './Grid';

export type ListGroupHorizontal = boolean | Breakpoint;

export interface ListGroupProps extends ComponentPropsWithRef<'ul'> {
    flush?: boolean;
    numbered?: boolean;
    horizontal?: ListGroupHorizontal;
}

export const ListGroup: FC<ListGroupProps> = ({
    flush,
    numbered,
    horizontal,
    className,
    ...props
}) => (
    <ul
        {...props}
        className={classNames(
            'list-group',
            { 'list-group-flush': flush, 'list-group-numbered': numbered },
            horizontal &&
                (horizontal === true
                    ? 'list-group-horizontal'
                    : `${horizontal}:list-group-horizontal`),
            className
        )}
    />
);

interface ListGroupItemStyleProps {
    theme?: ComponentTheme;
    action?: boolean;
    active?: boolean;
    disabled?: boolean;
}

type ListGroupItemLinkAttributes = ComponentPropsWithRef<'a'> & { href: string };
type ListGroupItemButtonAttributes = ComponentPropsWithRef<'button'> & { href?: never };
type ListGroupItemAttributes = ComponentPropsWithRef<'li'> & { href?: never; type?: never };
type ListGroupItemElementAttributes =
    ListGroupItemLinkAttributes | ListGroupItemButtonAttributes | ListGroupItemAttributes;

export type ListGroupItemProps = ListGroupItemStyleProps & ListGroupItemElementAttributes;

const isLink = (props: ListGroupItemElementAttributes): props is ListGroupItemLinkAttributes =>
    typeof props.href === 'string';

const isButton = (props: ListGroupItemElementAttributes): props is ListGroupItemButtonAttributes =>
    typeof props.type === 'string';

export const ListGroupItem: FC<ListGroupItemProps> = ({
    theme,
    action,
    active,
    disabled,
    className,
    ...props
}) => {
    const classes = classNames(
        'list-group-item',
        theme && `theme-${theme}`,
        action && 'list-group-item-action',
        { active, disabled },
        disabled && 'pe-none',
        className
    );

    return isLink(props) ? (
        <a
            {...props}
            className={classes}
            href={disabled ? undefined : props.href}
            aria-current={active ? 'true' : undefined}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : props.tabIndex}
            onClick={disabled ? undefined : props.onClick}
        />
    ) : isButton(props) ? (
        <button
            {...props}
            type={props.type || 'button'}
            className={classes}
            aria-current={active ? 'true' : undefined}
            disabled={disabled}
        />
    ) : (
        <li
            {...(props as ListGroupItemAttributes)}
            className={classes}
            aria-current={active ? 'true' : undefined}
            aria-disabled={disabled || undefined}
        />
    );
};

ListGroup.displayName = 'ListGroup';
ListGroupItem.displayName = 'ListGroupItem';
