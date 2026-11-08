import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { DocumentFrame } from '../component/Document/Frame';
import { ErrorHandler } from '../component/ErrorHandler';
import nextConfig from '../next.config';

export const metadata: Metadata = {
    title: 'Idea React · Advanced components for Bootstrap & React',
    description: 'TypeScript-first Bootstrap 6 & React components powered by MobX 6/7.'
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css"
                />
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/bootstrap-icons@1.13.2/font/bootstrap-icons.css"
                />
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/github-markdown-css@5.9.0/github-markdown.css"
                />
                <link
                    rel="alternate"
                    type="application/rss+xml"
                    title="Idea React documentation"
                    href={`${nextConfig.basePath || ''}/rss.xml`}
                />
            </head>
            <body>
                <ErrorHandler />
                <DocumentFrame>{children}</DocumentFrame>
            </body>
        </html>
    );
}
