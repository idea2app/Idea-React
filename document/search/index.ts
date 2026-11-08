import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createProcessor } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import type { Plugin } from 'vite';

import type { DocumentationSearchEntry } from '../component/Documentation/Search/model.ts';
import nextConfig from '../next.config.ts';

interface SearchNode {
    type: string;
    value?: string;
    depth?: number;
    children?: SearchNode[];
}

const textContent = (node: SearchNode): string =>
    ['text', 'inlineCode', 'code'].includes(node.type)
        ? node.value || ''
        : (node.children || []).map(textContent).join(' ');

const headingText = (node: SearchNode): string =>
    node.type === 'heading' && node.depth === 1
        ? textContent(node).trim()
        : (node.children || []).map(headingText).find(Boolean) || '';

const directory = fileURLToPath(new URL('../app/', import.meta.url));
const processor = createProcessor({ remarkPlugins: [remarkGfm] });

export async function* searchIndex(): AsyncGenerator<DocumentationSearchEntry> {
    for (const { name, parentPath } of await readdir(directory, {
        recursive: true,
        withFileTypes: true
    })) {
        if (name !== 'page.mdx') continue;

        const tree = processor.parse(await readFile(join(parentPath, name), 'utf8'));
        const path = relative(directory, parentPath);

        yield {
            title: headingText(tree) || path || 'Idea React',
            href: './' + path.split(sep).map(encodeURIComponent).join('/') + (path ? '/' : ''),
            description: textContent(tree).replace(/\s+/g, ' ').trim()
        };
    }
}

export const searchResources = (entries: readonly DocumentationSearchEntry[], origin: string) => {
    const url = new URL(origin);
    if (
        !['http:', 'https:'].includes(url.protocol) ||
        url.username ||
        url.password ||
        url.pathname !== '/' ||
        url.search ||
        url.hash
    )
        throw new Error('SITE_URL must be an HTTP(S) origin without a path, query or fragment.');

    const base = new URL(`${nextConfig.basePath || ''}/`, url);
    const escapeXML = (value: string) =>
        value.replace(/[<>&"']/g, character => `&#${character.charCodeAt(0)};`);
    const locations = entries
        .map(({ href }) => `<url><loc>${escapeXML(new URL(href, base).href)}</loc></url>`)
        .join('');
    const items = entries
        .map(({ title, href, description }) => {
            const link = escapeXML(new URL(href, base).href);

            return `<item><title>${escapeXML(title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><description>${escapeXML(description)}</description></item>`;
        })
        .join('');

    return {
        'rss.xml': {
            type: 'application/rss+xml',
            body: `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Idea React documentation</title><link>${escapeXML(base.href)}</link><description>Idea React documentation with full plain-text page content.</description><language>en</language>${items}</channel></rss>\n`
        },
        'sitemap.xml': {
            type: 'application/xml',
            body: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locations}</urlset>\n`
        },
        'robots.txt': {
            type: 'text/plain',
            body: `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', base).href}\n`
        }
    };
};

export const documentationSearch = (): Plugin => ({
    name: 'documentation-search',
    apply: 'serve',
    configureServer(server) {
        server.middlewares.use((request, response, next) => {
            const pathname = request.url?.split('?')[0];
            const filename = (['rss.xml', 'sitemap.xml', 'robots.txt'] as const).find(
                name => pathname === `${nextConfig.basePath || ''}/${name}`
            );
            if (!filename) return next();

            void Array.fromAsync(searchIndex())
                .then(entries => {
                    const origin = process.env.SITE_URL || `http://${request.headers.host}`;
                    const resources = searchResources(entries, origin);
                    const resource = resources[filename];

                    response.setHeader('Content-Type', `${resource.type}; charset=utf-8`);
                    response.setHeader('Cache-Control', 'no-store');
                    response.end(resource.body);
                })
                .catch(next);
        });
    }
});
