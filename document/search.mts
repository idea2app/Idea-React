import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Window } from 'happy-dom';

import nextConfig from './next.config.ts';

const directory = new URL(`./dist/client${nextConfig.basePath || ''}/`, import.meta.url);
const { DOMParser, happyDOM } = new Window();
const entries: Record<'title' | 'href' | 'description', string>[] = [];

try {
    for (const { name, parentPath } of await readdir(directory, {
        recursive: true,
        withFileTypes: true
    })) {
        if (!name.endsWith('.html') || name === '404.html') continue;

        const path = join(parentPath, name);
        const document = new DOMParser().parseFromString(await readFile(path, 'utf8'), 'text/html');
        if (
            document
                .querySelector('meta[name="robots"]')
                ?.getAttribute('content')
                ?.includes('noindex')
        )
            continue;

        const content = document.querySelector('main') || document.body;
        content
            .querySelectorAll('body > header, body > footer, nav, dialog, script, style, [hidden]')
            .forEach(element => element.remove());
        content
            .querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, li, pre, br')
            .forEach(element => element.before(' '));
        entries.push({
            title: content.querySelector('h1')?.textContent?.trim() || document.title,
            href:
                './' +
                relative(fileURLToPath(directory), path)
                    .split(sep)
                    .map(encodeURIComponent)
                    .join('/')
                    .replace(/(^|\/)index\.html$/, '$1'),
            description: content.textContent.replace(/\s+/g, ' ').trim()
        });
    }
    if (!entries.length) throw new Error('No exported pages found for the search index.');

    await writeFile(new URL('search-index.json', directory), JSON.stringify(entries));

    console.log(`Indexed ${entries.length} static page(s).`);
} finally {
    await happyDOM.close();
}
