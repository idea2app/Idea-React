/** @jsxImportSource preact */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createProcessor } from '@mdx-js/mdx';
import type { ComponentChildren } from 'preact';
import renderToString from 'preact-render-to-string';
import remarkGfm from 'remark-gfm';
import type { Plugin } from 'vite';

import type { DocumentSearchEntry } from '../component/Document/Search/model.ts';
import nextConfig from '../next.config.ts';

declare module 'preact' {
    // eslint-disable-next-line @typescript-eslint/no-namespace -- XML tags extend the JSX namespace.
    namespace JSX {
        interface IntrinsicElements extends Record<
            'channel' | 'description' | 'language' | 'item' | 'url' | 'loc',
            { children?: ComponentChildren; key?: string }
        > {
            rss: { version: string; children?: ComponentChildren };
            guid: { isPermaLink: string; children?: ComponentChildren };
            urlset: { xmlns: string; children?: ComponentChildren };
        }
    }
}

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

export async function* searchIndex(): AsyncGenerator<DocumentSearchEntry> {
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

export const searchResources = (entries: readonly DocumentSearchEntry[], origin: string) => {
    const url = new URL(origin);
    const { protocol, username, password, pathname, search, hash } = url;
    if (
        !['http:', 'https:'].includes(protocol) ||
        username ||
        password ||
        pathname !== '/' ||
        search ||
        hash
    )
        throw new Error('SITE_URL must be an HTTP(S) origin without a path, query or fragment.');

    const base = new URL(`${nextConfig.basePath || ''}/`, url);
    const rss = (
        <rss version="2.0">
            <channel>
                <title>Idea React documentation</title>
                <link>{base.href}</link>
                <description>
                    Idea React documentation with full plain-text page content.
                </description>
                <language>en</language>
                {entries.map(({ title, href, description }) => {
                    const link = new URL(href, base).href;

                    return (
                        <item key={link}>
                            <title>{title}</title>
                            <link>{link}</link>
                            <guid isPermaLink="true">{link}</guid>
                            <description>{description}</description>
                        </item>
                    );
                })}
            </channel>
        </rss>
    );
    const sitemap = (
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            {entries.map(({ href }) => (
                <url key={href}>
                    <loc>{new URL(href, base).href}</loc>
                </url>
            ))}
        </urlset>
    );
    const declaration = '<?xml version="1.0" encoding="UTF-8"?>\n';

    return {
        'rss.xml': {
            type: 'application/rss+xml',
            body: declaration + renderToString(rss)
        },
        'sitemap.xml': {
            type: 'application/xml',
            body: declaration + renderToString(sitemap)
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
                    const protocol = server.config.server.https ? 'https' : 'http';
                    const origin = `${protocol}://${request.headers.host}`;
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
