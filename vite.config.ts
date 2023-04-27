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
                include: /\.(mdx|js|jsx|ts|tsx)$/,
                babel: {
                    configFile: true
                }
            })
        ],
        build: {
            lib: {
                entry: resolve(__dirname, 'source/index.ts'),
                name: 'ReactComponents',
                fileName: format => `react-components.${format}.js`
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
        define: {
            __APP_ENV__: env.APP_ENV
        }
    };
});
