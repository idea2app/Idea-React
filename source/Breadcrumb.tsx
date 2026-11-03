import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from './Polymorphic';

export const Breadcrumb = polymorphic<ComponentPropsWithRef<'ol'>>(
    ({ as: Root = 'ol', className, ...props }) => (
        <Root {...props} className={classNames('breadcrumb', className)} />
    )
);

export const BreadcrumbItem = polymorphic<ComponentPropsWithRef<'li'>>(
    ({ as: Root = 'li', ...props }) => (
        <Root {...props} className={classNames('breadcrumb-item', props.className)} />
    )
);

export interface BreadcrumbLinkProps extends ComponentPropsWithRef<'a'> {
    active?: boolean;
}

export const BreadcrumbLink = polymorphic<BreadcrumbLinkProps>(
    ({
        as: Root = 'a',
        active,
        className,
        'aria-current': current = active ? 'page' : undefined,
        ...props
    }) => (
        <Root
            {...props}
            className={classNames('breadcrumb-link', { active }, className)}
            aria-current={current}
        />
    )
);

export const BreadcrumbDivider = polymorphic<ComponentPropsWithRef<'li'>>(
    ({ as: Root = 'li', className, ...props }) => (
        <Root
            {...props}
            className={classNames('breadcrumb-divider', className)}
            aria-hidden="true"
        />
    )
);

Breadcrumb.displayName = 'Breadcrumb';
BreadcrumbItem.displayName = 'BreadcrumbItem';
BreadcrumbLink.displayName = 'BreadcrumbLink';
BreadcrumbDivider.displayName = 'BreadcrumbDivider';
