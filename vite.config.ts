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
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        [
                            '@babel/plugin-proposal-class-properties',
                            { loose: true }
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
                external: ['react', 'react-dom'],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'react-dom'
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
