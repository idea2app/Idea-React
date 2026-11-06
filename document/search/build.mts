import { writeFile } from 'node:fs/promises';

import { searchIndex } from './index.ts';

const entries = await Array.fromAsync(searchIndex());

await writeFile(
    new URL('../dist/client/search-index.json', import.meta.url),
    JSON.stringify(entries)
);

console.log(`Indexed ${entries.length} MDX page(s).`);
