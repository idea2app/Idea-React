import classNames from 'classnames';
import { ComponentProps } from 'react';

import { Chip, ChipIcon } from '../../../../source/Base/Chip';
import styles from './style.module.css';

const upstreamTitle = 'Bootstrap documentation';

export type DocumentationHeadingProps = ComponentProps<'h1'> & {
    upstreamPath: string;
};

export const DocumentationHeading = ({
    upstreamPath,
    className,
    children,
    ...props
}: DocumentationHeadingProps) => (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100 mb-4">
        <h1 {...props} className={classNames('mb-0', className)}>
            {children}
        </h1>

        <Chip
            as="a"
            className="flex-shrink-0 ms-auto text-nowrap"
            href={`https://getbootstrap.com/docs/6.0/${upstreamPath}`}
            title={upstreamTitle}
        >
            <ChipIcon className={styles.icon} name="bootstrap" aria-hidden="true" />
            {upstreamTitle}
        </Chip>
    </div>
);
