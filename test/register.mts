import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

import { transformSync } from '@swc/core';

import { swcOptions } from '../swc.config.mts';

registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('.') && context.parentURL) {
            for (const extension of ['.ts', '.tsx', '/index.ts', '/index.tsx']) {
                const url = new URL(specifier + extension, context.parentURL);
                if (existsSync(url)) return nextResolve(url.href, context);
            }
        }
        return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
        if (url.endsWith('.css')) {
            return { format: 'module', source: 'export default {};', shortCircuit: true };
        }
        if (url.endsWith('.ts') || url.endsWith('.tsx')) {
            const filename = fileURLToPath(url);
            const { code } = transformSync(readFileSync(filename, 'utf8'), {
                ...swcOptions,
                filename,
                module: { type: 'es6' },
                sourceMaps: 'inline'
            });
            return { format: 'module', source: code, shortCircuit: true };
        }
        return nextLoad(url, context);
    }
});
