import { license, version } from '../../package.json';
import type { DocumentationLink } from '../component/Documentation/Header';
import type { DocumentationSearchEntry } from '../component/Documentation/Search/model';

export const site = {
    version,
    license,
    repository: 'https://github.com/idea2app/Idea-React',
    install: `npm i idea-react${version.includes('-') ? '@next' : ''}`,
    docs: 'https://idea2app.github.io/Idea-React/',
    gettingStarted: 'https://github.com/idea2app/Idea-React#usage',
    preview: 'https://idea2app.github.io/Idea-React/preview/'
};

export const navigation: DocumentationLink[] = [
    { label: 'Docs', href: site.docs },
    { label: 'Examples', href: site.preview },
    { label: 'API', href: site.docs },
    { label: 'Community', href: `${site.repository}/issues` }
];

export const versions: DocumentationLink[] = [
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

export const searchEntries: DocumentationSearchEntry[] = [
    {
        title: 'Getting started',
        href: site.gettingStarted,
        description: 'Install Idea React, peer dependencies, and styles.'
    },
    {
        title: 'Components',
        href: `${site.repository}#components`,
        description: 'Browse the Idea React component collection.'
    },
    {
        title: 'Dialog',
        href: `${site.repository}#dialog`,
        description: 'Asynchronous dialog workflows.'
    },
    {
        title: 'Toast',
        href: `${site.repository}#toast`,
        description: 'Application notifications.'
    },
    {
        title: 'API reference',
        href: site.docs,
        description: 'Components and utility API documentation.'
    },
    {
        title: 'Component examples',
        href: site.preview,
        description: 'Interactive examples of Idea React components.'
    }
];

export const footerColumns = [
    {
        title: 'Links',
        links: [
            { label: 'Home', href: './' },
            { label: 'Docs', href: site.docs },
            { label: 'API reference', href: site.docs },
            { label: 'Examples', href: site.preview }
        ]
    },
    {
        title: 'Guides',
        links: [
            { label: 'Getting started', href: site.gettingStarted },
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
