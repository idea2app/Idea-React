import { FC, PropsWithChildren } from 'react';

import { Badge } from '../../../../source/Badge';
import { Icon } from '../../../../source/Icon';
import { DocumentationLink } from '../Header';
import styles from './style.module.less';

export type DocumentationHeroProps = PropsWithChildren<{
    title: string;
    announcement: DocumentationLink;
}>;

export const DocumentationHero: FC<DocumentationHeroProps> = ({
    title,
    announcement,
    children
}) => (
    <main
        id="content"
        className={`${styles.masthead} d-grid align-items-center px-6 py-12`}
        tabIndex={-1}
    >
        <div className="container d-flex flex-column align-items-center gap-7 text-center">
            <Badge
                variant="subtle"
                theme="warning"
                className="d-inline-flex align-items-center gap-3 px-5 py-3 text-sm text-decoration-none"
                href={announcement.href}
                pill
            >
                {announcement.label}
                <Icon name="arrow-right" aria-hidden="true" />
            </Badge>
            <h1 className="text-4xl fw-semibold lh-1 text-balance mb-0">{title}</h1>
            {children}
        </div>
    </main>
);
