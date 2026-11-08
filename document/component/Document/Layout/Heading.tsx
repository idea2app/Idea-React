import classNames from 'classnames';
import { ComponentProps, FC } from 'react';

import { Stack } from '../../../../source/Base/Stack';
import { Chip, ChipIcon } from '../../../../source/Form/Chip';
import { site } from '../../../app/site';

const upstreamTitle = 'Bootstrap documentation';

export type DocumentHeadingProps = ComponentProps<'h1'> & {
    upstreamPath?: string;
    editPath: string;
};

export const DocumentHeading: FC<DocumentHeadingProps> = ({
    upstreamPath,
    editPath,
    className,
    children,
    ...props
}) => (
    <Stack
        as="hgroup"
        direction="horizontal"
        gap={3}
        className="flex-wrap align-items-center justify-content-between w-100 mb-4"
    >
        <h1 {...props} className={classNames('mb-0', className)}>
            {children}
        </h1>

        <Stack direction="horizontal" gap={2} className="flex-wrap ms-auto">
            {upstreamPath && (
                <Chip
                    as="a"
                    className="text-nowrap"
                    href={`https://getbootstrap.com/docs/6.0/${upstreamPath}`}
                    title={upstreamTitle}
                >
                    <ChipIcon style={{ color: '#712cf9' }} name="bootstrap" aria-hidden="true" />
                    {upstreamTitle}
                </Chip>
            )}
            <Chip as="a" className="text-nowrap" href={`${site.repository}/edit/main/${editPath}`}>
                <ChipIcon name="github" aria-hidden="true" />
                Edit in GitHub
            </Chip>
        </Stack>
    </Stack>
);
