'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, createContext, FC, useContext } from 'react';

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

interface PageState {
    active?: boolean;
    disabled?: boolean;
}

const PageContext = createContext<PageState>({});

export interface PageItemProps extends ComponentPropsWithRef<'li'>, PageState {}

export const PageItem: FC<PageItemProps> = ({ active, disabled, className, ...props }) => (
    <PageContext.Provider value={{ active, disabled }}>
        <li {...props} className={classNames('page-item', { active, disabled }, className)} />
    </PageContext.Provider>
);

export interface PageLinkProps extends ComponentPropsWithRef<'a'>, PageState {}

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
    const state = useContext(PageContext);
    const isActive = active ?? state.active;
    const isDisabled = disabled ?? state.disabled;

    return (
        <a
            {...props}
            className={classNames('page-link', className)}
            href={isDisabled ? undefined : href}
            tabIndex={isDisabled ? -1 : tabIndex}
            aria-disabled={isDisabled || undefined}
            aria-current={current ?? (isActive ? 'page' : undefined)}
            onClick={isDisabled ? undefined : onClick}
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
