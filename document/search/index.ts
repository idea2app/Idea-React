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

export const documentationSearch = (): Plugin => ({
    name: 'documentation-search',
    apply: 'serve',
    configureServer(server) {
        server.middlewares.use((request, response, next) => {
            if (request.url?.split('?')[0] !== `${nextConfig.basePath || ''}/search-index.json`)
                return next();

            void Array.fromAsync(searchIndex()).then(entries => {
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.setHeader('Cache-Control', 'no-store');
                response.end(JSON.stringify(entries));
            }, next);
        });
    }
});
