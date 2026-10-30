import { defineConfig } from 'tsdown';
import swc from 'unplugin-swc';

import { swcOptions } from './swc.config.mts';

const SWC = swc.rolldown({
    tsconfigFile: 'tsconfig.json',
    ...swcOptions
});

export default defineConfig({
    entry: 'source/index.ts',
    format: ['cjs', 'esm'],
    target: 'es2015',
    platform: 'browser',
    deps: { alwaysBundle: ['react-element-to-jsx-string'] },
    minify: true,
    dts: true,
    clean: true,
    logLevel: 'error',
    plugins: [SWC]
});
