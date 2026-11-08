import { readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { unrun } from 'unrun';
import { loadEnv } from 'vite';

const {
    module: { searchIndex, searchResources }
} = await unrun<typeof import('./index.tsx')>({
    path: new URL('./index.tsx', import.meta.url),
    inputOptions: { transform: { jsx: { runtime: 'automatic', importSource: 'preact' } } }
});

const { SITE_URL } = loadEnv('production', fileURLToPath(new URL('../', import.meta.url)), '');
const origin = process.env.SITE_URL || SITE_URL;
if (!origin)
    throw new Error('Set SITE_URL to the documentation deployment origin before building.');

const directory = new URL('../dist/client/', import.meta.url);
const entries = await Array.fromAsync(searchIndex());
const exported = new Set(
    (await readdir(directory, { recursive: true, withFileTypes: true }))
        .filter(({ name }) => name === 'index.html')
        .map(({ parentPath, name }) =>
            relative(fileURLToPath(directory), join(parentPath, name)).split(sep).join('/')
        )
);
const published = entries.filter(({ href }) =>
    exported.has(`${decodeURIComponent(href.slice(2))}index.html`)
);
const skipped = entries.filter(entry => !published.includes(entry));
if (skipped.length)
    console.warn(
        `Excluded pages without exported HTML: ${skipped.map(({ href }) => href).join(', ')}`
    );
if (!published.length) throw new Error('No exported MDX pages found for search and Sitemap.');

await Promise.all(
    Object.entries(searchResources(published, origin)).map(([filename, { body }]) =>
        writeFile(new URL(filename, directory), body)
    )
);

console.log(`Indexed ${published.length} MDX page(s) for search and Sitemap.`);
