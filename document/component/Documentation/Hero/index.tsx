import { FC, ReactNode } from 'react';

import { Badge } from '../../../../source/Badge';
import { Icon } from '../../../../source/Icon';
import { DocumentationLink } from '../Header';
import styles from './style.module.css';

export interface DocumentationHeroProps {
    title: string;
    description: ReactNode;
    announcement: DocumentationLink;
    version: string;
    links: readonly DocumentationLink[];
    children: ReactNode;
    promotion?: ReactNode;
}

export const DocumentationHero: FC<DocumentationHeroProps> = ({
    title,
    description,
    announcement,
    version,
    links,
    children,
    promotion
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
            <div>
                <h1 className="text-4xl fw-semibold lh-1 text-balance mb-5">{title}</h1>
                <p className="text-lg fg-2 text-balance mb-0">{description}</p>
            </div>
            <div className="d-flex flex-column sm:flex-row flex-wrap justify-content-center align-items-stretch gap-4 my-3 w-100">
                {children}
            </div>
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 fg-2 text-sm">
                <span>Currently v{version}</span>
                {links.map(({ href, label }) => (
                    <a key={href} href={href} className="fg-2">
                        {label}
                    </a>
                ))}
            </div>
            <div className={`${styles.promotion} mt-7 w-100`}>{promotion}</div>
        </div>
    </main>
);
