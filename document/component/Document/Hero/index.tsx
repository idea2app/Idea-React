import { FC, PropsWithChildren } from 'react';

import { Badge } from '../../../../source/Base/Badge';
import { Icon } from '../../../../source/Extension/Icon';
import { DocumentLink } from '../Header';
import { DocumentHeading } from '../Heading';
import styles from './style.module.less';

export type DocumentHeroProps = PropsWithChildren<{
    title: string;
    announcement: DocumentLink;
}>;

export const DocumentHero: FC<DocumentHeroProps> = ({ title, announcement, children }) => (
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
            <DocumentHeading
                className="text-4xl fw-semibold lh-1 text-balance mb-0"
                upstreamPath="getting-started/install/"
            >
                {title}
            </DocumentHeading>
            {children}
        </div>
    </main>
);
