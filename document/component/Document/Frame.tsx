import { PropsWithChildren } from 'react';

import { footerColumns, navigation, site, versions } from '../../app/site';
import nextConfig from '../../next.config';
import { ColorModeToggle } from '../ColorMode';
import { ColorModeProvider } from '../ColorMode/Provider';
import { DocumentFooter } from './Footer';
import style from './Frame.module.css';
import { DocumentHeader } from './Header';
import { DocumentSearch } from './Search';

export const DocumentFrame = ({ children }: PropsWithChildren) => (
    <ColorModeProvider>
        <div className={style.frame}>
            <div className={style.header}>
                <DocumentHeader
                    links={navigation}
                    versions={versions}
                    version={site.version}
                    search={<DocumentSearch indexUrl={`${nextConfig.basePath || ''}/rss.xml`} />}
                    colorMode={<ColorModeToggle />}
                />
            </div>
            {children}

            <div className={style.footer}>
                <DocumentFooter columns={footerColumns}>
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
                </DocumentFooter>
            </div>
        </div>
    </ColorModeProvider>
);

DocumentFrame.displayName = 'DocumentFrame';
