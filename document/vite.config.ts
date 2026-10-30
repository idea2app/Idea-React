import swc from 'unplugin-swc';
import vinext from 'vinext';
import { defineConfig } from 'vite';

import { swcOptions } from '../swc.config.mts';

export default defineConfig({
    plugins: [
        swc.vite({
            ...swcOptions,
            tsconfigFile: false
        }),
        vinext()
    ]
});
