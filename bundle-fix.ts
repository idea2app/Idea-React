#! /usr/bin/env ts-node

import { promises } from 'fs';

const list = process.argv.slice(2);

const CJS_pattern = /require\(('|").+?('|")\)/;

(async () => {
    console.log();
    console.time('Bundle fix');

    for (const file of list) {
        let code = await promises.readFile(file, { encoding: 'utf-8' });

        const isCJS = CJS_pattern.test(code);

        const CSS_pattern = isCJS
            ? /require\(('|").+?\.css('|")\);/g
            : /import\s*('|").+?\.css('|");/g;

        code = code.replace(CSS_pattern, '').trim();

        if (isCJS) code = code.replace(/import(".+?")/g, 'require($1)');

        await promises.writeFile(file, code);

        console.log(`[fixed] ${file}`);
    }
    console.timeEnd('Bundle fix');
})();
