import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';

export const Breadcrumb = polymorphic<ComponentPropsWithRef<'ol'>>(
    ({ as: Root = 'ol', className, ...props }) => (
        <Root {...props} className={classNames('breadcrumb', className)} />
    )
);
Breadcrumb.displayName = 'Breadcrumb';

export type BreadcrumbItemProps = ComponentPropsWithRef<'li'> & { active?: boolean };

export const BreadcrumbItem = polymorphic<BreadcrumbItemProps>(
    ({
        as: Root = 'li',
        active,
        className,
        'aria-current': current = active ? 'page' : undefined,
        ...props
    }) => (
        <Root
            {...props}
            className={classNames('breadcrumb-item', { active }, className)}
            aria-current={current}
        />
    )
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

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
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbDivider = polymorphic<ComponentPropsWithRef<'li'>>(
    ({ as: Root = 'li', className, ...props }) => (
        <Root
            {...props}
            className={classNames('breadcrumb-divider', className)}
            aria-hidden="true"
        />
    )
);
BreadcrumbDivider.displayName = 'BreadcrumbDivider';
