import classNames from 'classnames';
import { cloneElement, ComponentPropsWithRef, isValidElement } from 'react';

import { ComponentTheme } from './Button';
import { polymorphic } from './Polymorphic';

export interface PaginationProps extends ComponentPropsWithRef<'ul'> {
    theme?: ComponentTheme;
    size?: 'sm' | 'lg';
}

export const Pagination = polymorphic<PaginationProps>(
    ({ as: Root = 'ul', theme, size, className, ...props }) => (
        <Root
            {...props}
            className={classNames(
                'pagination',
                theme && `theme-${theme}`,
                size && `pagination-${size}`,
                className
            )}
        />
    )
);
Pagination.displayName = 'Pagination';

type PageState = Partial<Record<'active' | 'disabled', boolean>>;

export type PageItemProps = ComponentPropsWithRef<'li'> & PageState;

export const PageItem = polymorphic<PageItemProps>(
    ({ as: Root = 'li', active, disabled, className, children, ...props }) => {
        const child =
            isValidElement<PageLinkProps>(children) && children.type === PageLink
                ? cloneElement(children, {
                      active: children.props.active ?? active,
                      disabled: children.props.disabled ?? disabled
                  })
                : children;

        return (
            <Root {...props} className={classNames('page-item', { active, disabled }, className)}>
                {child}
            </Root>
        );
    }
);
PageItem.displayName = 'PageItem';

export type PageLinkProps = ComponentPropsWithRef<'a'> & PageState;

export const PageLink = polymorphic<PageLinkProps>(
    ({
        as: RootAs,
        active,
        disabled,
        className,
        href,
        tabIndex,
        onClick,
        'aria-current': current,
        ...props
    }) => {
        const Root = RootAs ?? (href === undefined ? 'span' : 'a');

        return (
            <Root
                {...props}
                className={classNames('page-link', className)}
                href={disabled ? undefined : href}
                tabIndex={disabled ? -1 : tabIndex}
                aria-disabled={disabled || undefined}
                aria-current={current ?? (active ? 'page' : undefined)}
                onClick={disabled ? undefined : onClick}
            />
        );
    }
);
PageLink.displayName = 'PageLink';

export const PageText = polymorphic<ComponentPropsWithRef<'span'>>(
    ({ as: Root = 'span', className, ...props }) => (
        <Root {...props} className={classNames('page-link', className)} />
    )
);
PageText.displayName = 'PageText';
