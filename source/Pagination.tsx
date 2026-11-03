import classNames from 'classnames';
import { cloneElement, ComponentPropsWithRef, FC, isValidElement } from 'react';

import { ComponentTheme } from './Button';

export interface PaginationProps extends ComponentPropsWithRef<'ul'> {
    theme?: ComponentTheme;
    size?: 'sm' | 'lg';
}

export const Pagination: FC<PaginationProps> = ({ theme, size, className, ...props }) => (
    <ul
        {...props}
        className={classNames(
            'pagination',
            theme && `theme-${theme}`,
            size && `pagination-${size}`,
            className
        )}
    />
);

type PageState = Partial<Record<'active' | 'disabled', boolean>>;

export type PageItemProps = ComponentPropsWithRef<'li'> & PageState;

export const PageItem: FC<PageItemProps> = ({
    active,
    disabled,
    className,
    children,
    ...props
}) => {
    const child =
        isValidElement<PageLinkProps>(children) && children.type === PageLink
            ? cloneElement(children, {
                  active: children.props.active ?? active,
                  disabled: children.props.disabled ?? disabled
              })
            : children;

    return (
        <li {...props} className={classNames('page-item', { active, disabled }, className)}>
            {child}
        </li>
    );
};

export type PageLinkProps = ComponentPropsWithRef<'a'> & PageState;

export const PageLink: FC<PageLinkProps> = ({
    active,
    disabled,
    className,
    href,
    tabIndex,
    onClick,
    'aria-current': current,
    ...props
}) => {
    const linkProps = {
        ...props,
        className: classNames('page-link', className),
        tabIndex: disabled ? -1 : tabIndex,
        'aria-disabled': disabled || undefined,
        'aria-current': current ?? (active ? 'page' : undefined)
    };

    return href !== undefined ? (
        <a
            {...linkProps}
            href={disabled ? undefined : href}
            onClick={disabled ? undefined : onClick}
        />
    ) : (
        <span
            {...props}
            className={classNames('page-link', className)}
            aria-disabled={disabled || undefined}
            aria-current={current ?? (active ? 'page' : undefined)}
        />
    );
};

export const PageText: FC<ComponentPropsWithRef<'span'>> = ({ className, ...props }) => (
    <span {...props} className={classNames('page-link', className)} />
);

Pagination.displayName = 'Pagination';
PageItem.displayName = 'PageItem';
PageLink.displayName = 'PageLink';
PageText.displayName = 'PageText';
