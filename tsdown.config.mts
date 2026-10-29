import swc from 'unplugin-swc';
import { defineConfig } from 'tsdown';

const SWC = swc.rolldown({
    tsconfigFile: 'tsconfig.json',
    jsc: {
        target: 'es2015',
        externalHelpers: true,
        parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true
        },
        transform: {
            decoratorVersion: '2022-03',
            useDefineForClassFields: true,
            react: {
                runtime: 'automatic'
            }
        }
    }
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
