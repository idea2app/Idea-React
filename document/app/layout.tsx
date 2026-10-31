import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { ColorModeToggle } from '../component/ColorMode';
import { DocumentationFooter } from '../component/Documentation/Footer';
import { DocumentationHeader } from '../component/Documentation/Header';
import { DocumentationSearch } from '../component/Documentation/Search';
import { ErrorHandler } from '../component/ErrorHandler';
import nextConfig from '../next.config';
import { footerColumns, navigation, site, versions } from './site';

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

                <DocumentationFooter columns={footerColumns}>
                    <p className="mb-3">
                        Advanced React components by <a href="https://idea2.app/">idea2app</a>,
                        built with the help of{' '}
                        <a href={`${site.repository}/graphs/contributors`}>our contributors</a>.
                    </p>
                    <p className="mb-3">
                        Licensed{' '}
                        <a href="https://spdx.org/licenses/LGPL-3.0-or-later.html">
                            {site.license}
                        </a>
                        . Currently v{site.version}.
                    </p>
                    <p className="mb-0">
                        An independent React adaptation of the{' '}
                        <a href="https://getbootstrap.com/">upstream website</a>. Upstream code:{' '}
                        <a href={`${nextConfig.basePath || ''}/BOOTSTRAP-LICENSE.txt`}>MIT</a>;
                        documentation:{' '}
                        <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
                    </p>
                </DocumentationFooter>
            </body>
        </html>
    );
}
