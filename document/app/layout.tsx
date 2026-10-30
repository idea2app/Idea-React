import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { ColorModeToggle } from '../component/ColorMode';
import { DocumentationHeader } from '../component/Documentation/Header';
import { DocumentationSearch } from '../component/Documentation/Search';
import { ErrorHandler } from '../component/ErrorHandler';
import nextConfig from '../next.config';
import { navigation, site, versions } from './site';

export const metadata: Metadata = {
    title: 'Idea React · Advanced components for Bootstrap & React',
    description: 'TypeScript-first Bootstrap 6 & React components powered by MobX 6/7.'
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css"
                />
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/bootstrap-icons@1.13.1/font/bootstrap-icons.css"
                />
            </head>
            <body>
                <ErrorHandler />

                <DocumentationHeader
                    links={navigation}
                    versions={versions}
                    version={site.version}
                    search={
                        <DocumentationSearch
                            indexUrl={`${nextConfig.basePath || ''}/search-index.json`}
                        />
                    }
                    colorMode={<ColorModeToggle />}
                />
                {children}
            </body>
        </html>
    );
}
