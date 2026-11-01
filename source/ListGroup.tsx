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

export interface ListGroupItemProps extends ComponentPropsWithRef<'li'> {
    theme?: ComponentTheme;
    action?: boolean;
    active?: boolean;
    disabled?: boolean;
}

export const ListGroupItem: FC<ListGroupItemProps> = ({
    action,
    active,
    disabled,
    theme,
    className,
    ...props
}) => (
    <li
        {...props}
        className={classNames(
            'list-group-item',
            { 'list-group-item-action': action, active, disabled },
            theme && `theme-${theme}`,
            className
        )}
        aria-current={active ? 'true' : undefined}
        aria-disabled={disabled || undefined}
    />
);

ListGroup.displayName = 'ListGroup';
ListGroupItem.displayName = 'ListGroupItem';
