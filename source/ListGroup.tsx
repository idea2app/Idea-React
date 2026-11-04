import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import type { ComponentTheme } from './Button';
import type { Breakpoint } from './Grid';
import { polymorphic } from './Polymorphic';

export type ListGroupHorizontal = boolean | Breakpoint;

interface ListGroupStyleProps {
    flush?: boolean;
    numbered?: boolean;
    horizontal?: ListGroupHorizontal;
}

export type ListGroupProps = ListGroupStyleProps &
    (
        | (ComponentPropsWithRef<'ul'> & { as?: 'ul' })
        | (ComponentPropsWithRef<'ol'> & { as: 'ol' })
        | (ComponentPropsWithRef<'div'> & { as: 'div' })
    );

export const ListGroup = polymorphic<ListGroupStyleProps & ComponentPropsWithRef<'ul'>>(
    ({ as: Root = 'ul', flush, numbered, horizontal, className, ...props }) => {
        const classes = classNames(
            'list-group',
            { 'list-group-flush': flush, 'list-group-numbered': numbered },
            horizontal &&
                (horizontal === true
                    ? 'list-group-horizontal'
                    : `${horizontal}:list-group-horizontal`),
            className
        );

        return <Root {...props} className={classes} />;
    }
);
ListGroup.displayName = 'ListGroup';

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

export const ListGroupItem = polymorphic<ListGroupItemProps>(
    ({ as: RootAs, theme, action, active, disabled, className, ...props }) => {
        const Root = RootAs ?? 'a';
        const Root1 = RootAs ?? 'button';
        const Root2 = RootAs ?? 'li';

        const classes = classNames(
            'list-group-item',
            theme && `theme-${theme}`,
            action && 'list-group-item-action',
            { active, disabled },
            disabled && 'pe-none',
            className
        );

        return isLink(props) ? (
            <Root
                {...props}
                className={classes}
                href={disabled ? undefined : props.href}
                aria-current={active ? 'true' : undefined}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : props.tabIndex}
                onClick={disabled ? undefined : props.onClick}
            />
        ) : isButton(props) ? (
            <Root1
                {...props}
                type={props.type || 'button'}
                className={classes}
                aria-current={active ? 'true' : undefined}
                disabled={disabled}
            />
        ) : (
            <Root2
                {...(props as ListGroupItemAttributes)}
                className={classes}
                aria-current={active ? 'true' : undefined}
                aria-disabled={disabled || undefined}
            />
        );
    }
);
ListGroupItem.displayName = 'ListGroupItem';
