import { fileURLToPath } from 'node:url';

import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import swc from 'unplugin-swc';
import { unrun } from 'unrun';
import vinext from 'vinext';
import { defineConfig, perEnvironmentPlugin, ResolvedConfig } from 'vite';

import { swcOptions } from '../swc.config.mts';
import { remarkInlineButtonChildren } from './plugin/inline-children.ts';
import { remarkMermaid } from './plugin/Mermaid.ts';
import { recmaRscStyles } from './plugin/RSC-style.ts';

export default defineConfig(async () => {
    const path = new URL('./search/index.tsx', import.meta.url);
    const {
        module: { documentationSearch }
    } = await unrun<typeof import('./search/index.tsx')>({
        path,
        inputOptions: { transform: { jsx: { runtime: 'automatic', importSource: 'preact' } } }
    });

    return {
        resolve: {
            alias: {
                '@document/MDXComponents': fileURLToPath(
                    new URL('./component/Document/MDXComponents.tsx', import.meta.url)
                )
            }
        },
        css: {
            lightningcss: {
                // Preserve light-dark(): Bootstrap's color-scheme rules are loaded separately.
                exclude: 1 << 20
            }
        },
        plugins: [
            {
                ...documentationSearch(),
                configResolved({ configFileDependencies }: ResolvedConfig) {
                    // unrun loads this module outside Vite's dependency graph.
                    configFileDependencies.push(fileURLToPath(path));
                }
            },
            perEnvironmentPlugin('@mdx-js/rollup', ({ name, config }) => {
                const { transform } = mdx({
                    development: config.command === 'serve',
                    providerImportSource: '@document/MDXComponents',
                    remarkPlugins: [remarkGfm, remarkInlineButtonChildren, remarkMermaid],
                    // RSC's automatic CSS wrapper only recognizes JS/TS module extensions.
                    recmaPlugins: name === 'rsc' ? [recmaRscStyles] : []
                });

                return { name: '@mdx-js/rollup', transform };
            }),
            swc.vite({
                ...swcOptions,
                tsconfigFile: false
            }),
            vinext()
        ]
    };
});
