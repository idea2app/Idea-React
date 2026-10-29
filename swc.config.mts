import type { Options } from '@swc/core';

export const swcOptions = {
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
            react: { runtime: 'automatic' }
        }
    }
} satisfies Options;
