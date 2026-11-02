import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export const Breadcrumb: FC<ComponentPropsWithRef<'ol'>> = ({ className, ...props }) => (
    <ol {...props} className={classNames('breadcrumb', className)} />
);

export const BreadcrumbItem: FC<ComponentPropsWithRef<'li'>> = props => (
    <li {...props} className={classNames('breadcrumb-item', props.className)} />
);

export interface BreadcrumbLinkProps extends ComponentPropsWithRef<'a'> {
    active?: boolean;
}

export const BreadcrumbLink: FC<BreadcrumbLinkProps> = ({
    active,
    className,
    'aria-current': current = active ? 'page' : undefined,
    ...props
}) => (
    <a
        {...props}
        className={classNames('breadcrumb-link', { active }, className)}
        aria-current={current}
    />
);

export const BreadcrumbDivider: FC<ComponentPropsWithRef<'li'>> = ({ className, ...props }) => (
    <li {...props} className={classNames('breadcrumb-divider', className)} aria-hidden="true" />
);

Breadcrumb.displayName = 'Breadcrumb';
BreadcrumbItem.displayName = 'BreadcrumbItem';
BreadcrumbLink.displayName = 'BreadcrumbLink';
BreadcrumbDivider.displayName = 'BreadcrumbDivider';
