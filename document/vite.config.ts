import { fileURLToPath } from 'node:url';

import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import swc from 'unplugin-swc';
import { unrun } from 'unrun';
import vinext from 'vinext';
import { defineConfig, ESTree, parseSync, perEnvironmentPlugin, ResolvedConfig } from 'vite';

import { swcOptions } from '../swc.config.mts';

interface MdastNode {
    type: string;
    name?: string | null;
    lang?: string | null;
    value?: string;
    depth?: number;
    attributes?: MdastNode[];
    // eslint-disable-next-line no-restricted-syntax -- AST children are not component props.
    children?: MdastNode[];
}

interface HastNode {
    type: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    // eslint-disable-next-line no-restricted-syntax -- AST children are not component props.
    children?: HastNode[];
}

const inlineElements = new Set([
    'a',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'AccordionHeader',
    'AccordionToggle',
    'AlertLink',
    'AlertHeading',
    'Avatar',
    'Badge',
    'BreadcrumbLink',
    'Button',
    'button',
    'CardTitle',
    'CardSubtitle',
    'CardText',
    'CarouselImage',
    'ChipDismiss',
    'ChipInputLabel',
    'Chip',
    'CloseButton',
    'CollapseToggle',
    'ComboboxOption',
    'DatePickerButton',
    'DialogTitle',
    'DrawerTitle',
    'label',
    'FormLabel',
    'FormLegend',
    'FormAdornment',
    'FormAdornmentText',
    'FormSwitch',
    'FormText',
    'FormFeedback',
    'InputGroupText',
    'InputGroupButton',
    'ListGroupItem',
    'MenuItem',
    'MenuItemContent',
    'NavbarBrand',
    'NavLink',
    'PageLink',
    'PageText',
    'PlaceholderButton',
    'Popover',
    'Progress',
    'span',
    'SpinnerButton',
    'StepperButton',
    'StepperLink',
    'ToggleButton',
    'Toggler',
    'Tooltip',
    'th',
    'td'
]);

const visit = (node: MdastNode) => {
    for (const child of node.children || []) {
        if (child.type === 'mdxJsxFlowElement' && child.children && inlineElements.has(child.name!))
            child.children = child.children.flatMap(grandChild =>
                grandChild.type === 'paragraph' ? grandChild.children || [] : [grandChild]
            );
        visit(child);
    }
};
const remarkInlineButtonChildren = () => (tree: MdastNode) => visit(tree);

const rehypeBootstrapTable = () => (tree: HastNode) => {
    const visit = (node: HastNode) => {
        if (!node.children) return;

        node.children = node.children.map(child => {
            if (child.type !== 'element' || child.tagName !== 'table') {
                visit(child);

                return child;
            }
            child.properties = { ...child.properties, className: ['table'] };

            return {
                type: 'element',
                tagName: 'div',
                properties: { className: ['table-responsive'] },
                children: [child]
            };
        });
    };
    visit(tree);
};

const recmaRscStyles = () => (tree: ESTree.Program) => {
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
                    remarkPlugins: [remarkGfm, remarkInlineButtonChildren],
                    rehypePlugins: [rehypeBootstrapTable],
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
