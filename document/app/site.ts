import { license, version } from '../../package.json';
import type { DocumentLink } from '../component/Document/Header';
import nextConfig from '../next.config';

export const site = {
    version,
    license,
    repository: 'https://github.com/idea2app/Idea-React',
    install: `npm i idea-react${version.includes('-') ? '@next' : ''}`,
    docs: `${nextConfig.basePath || ''}/guides/install/`,
    api: 'https://idea2app.github.io/Idea-React/',
    components: `${nextConfig.basePath || ''}/components/`,
    forms: `${nextConfig.basePath || ''}/forms/`,
    guides: `${nextConfig.basePath || ''}/guides/`
};

export const navigation: DocumentLink[] = [
    { label: 'Docs', href: site.docs },
    { label: 'API', href: site.api },
    { label: 'Community', href: `${site.repository}/issues` }
];

export const versions: DocumentLink[] = [
    {
        label: `v${version} (prerelease)`,
        href: `https://www.npmjs.com/package/idea-react/v/${version}`
    },
    {
        label: 'Stable release',
        href: 'https://www.npmjs.com/package/idea-react?activeTab=versions'
    },
    { label: 'All releases', href: `${site.repository}/releases` }
];

export const footerColumns = [
    {
        title: 'Links',
        links: [
            { label: 'Home', href: './' },
            { label: 'Docs', href: site.docs },
            { label: 'API reference', href: site.api }
        ]
    },
    {
        title: 'Guides',
        links: [
            { label: 'Guides', href: site.guides },
            { label: 'Migration', href: `${site.guides}migration/` },
            { label: 'React + MobX', href: 'https://github.com/idea2app/React-MobX-Bootstrap-ts' },
            { label: 'Next.js starter', href: 'https://github.com/idea2app/Next-Bootstrap-ts' },
            { label: 'Source code', href: `${site.repository}/tree/main/source` }
        ]
    },
    {
        title: 'Projects',
        links: [
            { label: 'Idea React', href: site.repository },
            { label: 'RESTful tables', href: 'https://github.com/idea2app/MobX-RESTful-table' },
            { label: 'OpenReactMap', href: 'https://github.com/idea2app/OpenReactMap' },
            { label: 'idea2app', href: 'https://idea2.app/' }
        ]
    },
    {
        title: 'Community',
        links: [
            { label: 'Issues', href: `${site.repository}/issues` },
            { label: 'Pull requests', href: `${site.repository}/pulls` },
            { label: 'Contributors', href: `${site.repository}/graphs/contributors` },
            { label: 'npm', href: 'https://www.npmjs.com/package/idea-react' }
        ]
    }
];
