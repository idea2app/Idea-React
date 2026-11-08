'use client';

import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { footerColumns, navigation, site, versions } from '../../app/site';
import nextConfig from '../../next.config';
import { ColorModeToggle } from '../ColorMode';
import { ColorModeProvider } from '../ColorMode/Provider';
import { DocumentFooter } from './Footer';
import { DocumentHeader } from './Header';
import { DocumentSearch } from './Search';

export const DocumentFrame = ({ children }: PropsWithChildren) => {
    const pathname = usePathname();
    const basePath = nextConfig.basePath || '';
    const routePath =
        basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
            ? pathname.slice(basePath.length) || '/'
            : pathname;
    const isExamplePage = routePath.startsWith('/examples/') && routePath !== '/examples/';

    return isExamplePage ? (
        children
    ) : (
        <ColorModeProvider>
            <DocumentHeader
                links={navigation}
                versions={versions}
                version={site.version}
                search={<DocumentSearch indexUrl={`${basePath}/rss.xml`} />}
                colorMode={<ColorModeToggle />}
            />
            {children}

            <DocumentFooter columns={footerColumns}>
                <p className="mb-3">
                    Advanced React components by <a href="https://idea2.app/">idea2app</a>, built
                    with the help of{' '}
                    <a href={`${site.repository}/graphs/contributors`}>our contributors</a>.
                </p>
                <p className="mb-3">
                    Licensed{' '}
                    <a href="https://spdx.org/licenses/LGPL-3.0-or-later.html">{site.license}</a>.
                    Currently v{site.version}.
                </p>
                <p className="mb-0">
                    An independent React adaptation of the{' '}
                    <a href="https://getbootstrap.com/">upstream website</a>. Upstream code:{' '}
                    <a href={`${basePath}/BOOTSTRAP-LICENSE.txt`}>MIT</a>; documentation:{' '}
                    <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
                </p>
            </DocumentFooter>
        </ColorModeProvider>
    );
};

DocumentFrame.displayName = 'DocumentFrame';
