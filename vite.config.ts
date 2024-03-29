import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import postcssPresetEnv from 'postcss-preset-env';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        css: {
            modules: {
                localsConvention: 'camelCase',
                scopeBehaviour: 'local',
                generateScopedName: '[name]_[local]_[hash:5]'
            },
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true
                }
            },
            postcss: {
                plugins: [postcssPresetEnv()]
            }
        },
        plugins: [
            react({
                babel: {
                    presets: [
                        [
                            '@babel/preset-typescript',
                            {
                                allowDeclareFields: true,
                                allowNamespaces: true,
                                allExtensions: true,
                                isTSX: true
                            }
                        ]
                    ],
                    plugins: [
                        [
                            '@babel/plugin-proposal-decorators',
                            { version: '2023-05' }
                        ]
                    ]
                }
            })
        ],
        build: {
            lib: {
                entry: resolve(__dirname, 'source/index.ts'),
                name: 'Idea-React',
                fileName: format => `index.${format}.js`
            },
            rollupOptions: {
                external: [
                    '@editorjs/editorjs',
                    '@editorjs/paragraph',
                    'classnames',
                    'editorjs-html',
                    'iterable-observer',
                    'lodash',
                    'mobx',
                    'mobx-react',
                    'prismjs',
                    'react',
                    'react-bootstrap',
                    'react-dom',
                    'react-editor-js',
                    'react-element-to-jsx-string',
                    'web-utility'
                ],
                output: {
                    globals: {
                        '@editorjs/editorjs': 'EditorJS',
                        '@editorjs/paragraph': 'Paragraph',
                        classnames: 'classNames',
                        'editorjs-html': 'edjsHTML',
                        'iterable-observer': 'IterableObserver',
                        lodash: '_',
                        mobx: 'mobx',
                        'mobx-react': 'mobxReact',
                        prismjs: 'Prism',
                        react: 'React',
                        'react-bootstrap': 'ReactBootstrap',
                        'react-dom': 'ReactDOM',
                        'react-editor-js': 'createReactEditorJS'
                    }
                }
            }
        },
        server: {
            hmr: {
                overlay: false
            }
        },
        define: {
            __APP_ENV__: env.APP_ENV
        }
    };
});
