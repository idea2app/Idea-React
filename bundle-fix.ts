#! /usr/bin/env ts-node

import { promises } from 'fs';

const list = [
    { file: 'dist/index.js', pattern: 'import "./index.css";' },
    { file: 'dist/index.umd.js', pattern: 'require("./index.umd.css");' }
];

(async () => {
    console.log();
    console.time('Bundle fix');

    for (const { file, pattern } of list) {
        const code = await promises.readFile(file, { encoding: 'utf-8' });

        await promises.writeFile(file, code.replace(pattern, '').trim());

        console.log(`[fixed] ${file}`);
    }
    console.timeEnd('Bundle fix');
})();
