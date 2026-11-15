import { ESTree, parseSync } from 'vite';

export const recmaRscStyles = () => (tree: ESTree.Program) => {
    const importsStyles = tree.body.some(
        node =>
            node.type === 'ImportDeclaration' &&
            typeof node.source.value === 'string' &&
            /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/.test(node.source.value) &&
            !/[?&](?:url|inline|raw)(?:$|=|&)/.test(node.source.value)
    );
    if (!importsStyles) return;

    const component = tree.body.find(node => node.type === 'ExportDefaultDeclaration');
    if (
        component?.type !== 'ExportDefaultDeclaration' ||
        component.declaration.type !== 'FunctionDeclaration' ||
        !component.declaration.body
    )
        throw new Error('Expected the MDX compiler to export a default function.');

    const result = component.declaration.body.body.find(node => node.type === 'ReturnStatement');

    if (result?.type !== 'ReturnStatement' || !result.argument)
        throw new Error('Expected the MDX component to return content.');

    const { program: resources, errors } = parseSync(
        'mdx-styles.js',
        `
        import * as __ideaMdxCss from 'react';
        __ideaMdxCss.createElement(
            __ideaMdxCss.Fragment, null, import.meta.viteRsc.loadCss(), null
        );
    `
    );
    if (errors.length) throw new Error(errors.map(({ message }) => message).join('\n'));

    const [, wrapper] = resources.body;

    if (wrapper.type !== 'ExpressionStatement' || wrapper.expression.type !== 'CallExpression')
        throw new Error('Expected the MDX stylesheet wrapper to be a call.');

    wrapper.expression.arguments[3] = result.argument;
    result.argument = wrapper.expression;
    tree.body.unshift(resources.body[0]);
};
