import swc from 'unplugin-swc';
import { defineConfig } from 'tsdown';
import { fileURLToPath } from 'url';

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

const jsxStringESM = fileURLToPath(
    import.meta.resolve('react-element-to-jsx-string/dist/esm/index.js')
);

export default defineConfig({
    entry: 'source/index.ts',
    format: ['cjs', 'esm'],
    target: 'es2015',
    platform: 'browser',
    deps: { alwaysBundle: ['react-element-to-jsx-string'] },
    alias: { 'react-element-to-jsx-string': jsxStringESM },
    minify: true,
    dts: true,
    clean: true,
    logLevel: 'error',
    plugins: [SWC]
});
