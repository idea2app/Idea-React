import { FC, PropsWithChildren } from 'react';

import { Icon } from '../../../source/Icon';
import { DocumentationLink } from './Header';

export type DocumentationFooterProps = PropsWithChildren<{
    columns: readonly { title: string; links: readonly DocumentationLink[] }[];
    homeHref?: string;
    brand?: string;
}>;

export const DocumentationFooter: FC<DocumentationFooterProps> = ({
    columns,
    children,
    homeHref = './',
    brand = 'Idea React'
}) => (
    <footer className="container mt-12 py-12 px-6 fg-2">
        <div className="row g-9">
            <div className="col-12 lg:col-4">
                <a
                    href={homeHref}
                    className="d-inline-flex align-items-center gap-3 mb-4 fg-body text-lg text-decoration-none"
                >
                    <Icon name="code-square" size={2} aria-hidden="true" />
                    <span>{brand}</span>
                </a>
                <div className="text-sm">{children}</div>
            </div>
            {columns.map(({ title, links }) => (
                <section key={title} className="col-6 md:col-3 lg:col-2">
                    <h2 className="text-lg fw-medium mb-3">{title}</h2>
                    <ul className="list-unstyled mb-0">
                        {links.map(({ href, label }) => (
                            <li key={href} className="mb-3">
                                <a href={href} className="fg-2 text-decoration-none">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    </footer>
);
