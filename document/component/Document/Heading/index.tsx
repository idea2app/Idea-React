import classNames from 'classnames';
import { Children, ComponentProps, FC } from 'react';

import { Stack } from '../../../../source/Base/Stack';
import { Chip, ChipIcon } from '../../../../source/Form/Chip';
import { documentGroups } from '../Sidebar';

const upstreamTitle = 'Bootstrap documentation';

export type DocumentHeadingProps = ComponentProps<'h1'> & {
    upstreamPath?: string;
};

export const DocumentHeading: FC<DocumentHeadingProps> = ({
    upstreamPath,
    className,
    children,
    ...props
}) => {
    const title = Children.toArray(children)
        .filter(child => typeof child === 'string')
        .join('')
        .toLowerCase();
    const group = documentGroups.find(
        ({ slug, items }) =>
            ['components', 'forms', 'content', 'layout'].includes(slug) &&
            items.some(({ label, heading = label }) => heading.toLowerCase() === title)
    );
    const item = group?.items.find(({ label, heading = label }) => heading.toLowerCase() === title);
    const path =
        upstreamPath ??
        (title === 'forms'
            ? 'forms/overview/'
            : group && item
              ? `${group.itemHref}${item.slug}/`
              : 'getting-started/install/');

    return (
        <Stack
            as="hgroup"
            direction="horizontal"
            gap={3}
            className="flex-wrap align-items-center justify-content-between w-100 mb-4"
        >
            <h1 {...props} className={classNames('mb-0', className)}>
                {children}
            </h1>

            <Chip
                as="a"
                className="flex-shrink-0 ms-auto text-nowrap"
                href={`https://getbootstrap.com/docs/6.0/${path}`}
                title={upstreamTitle}
            >
                <ChipIcon style={{ color: '#712cf9' }} name="bootstrap" aria-hidden="true" />
                {upstreamTitle}
            </Chip>
        </Stack>
    );
};
