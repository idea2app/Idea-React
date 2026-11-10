import config from 'eslint-idea2app-next-js';

export default [
    ...config,
    {
        files: ['document/app/examples/**/page.tsx'],
        rules: {
            'jsx-a11y/anchor-is-valid': ['error', { aspects: ['noHref', 'preferButton'] }]
        }
    }
];
