import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import swc from 'unplugin-swc';
import vinext from 'vinext';
import { defineConfig } from 'vite';

import { swcOptions } from '../swc.config.mts';

interface MdastNode {
    type: string;
    name?: string | null;
    children?: MdastNode[];
}

interface HastNode {
    type: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    children?: HastNode[];
}

const inlineElements = new Set([
    'a',
    'Avatar',
    'Badge',
    'Button',
    'button',
    'CloseButton',
    'label',
    'FormLabel',
    'FormAdornment',
    'FormAdornmentText',
    'FormSwitch',
    'FormText',
    'InputGroupText',
    'MenuItem',
    'MenuItemContent',
    'NavbarBrand',
    'NavLink',
    'Option',
    'span',
    'SpinnerButton',
    'ToggleButton'
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

export default defineConfig({
    plugins: [
        mdx({
            remarkPlugins: [remarkGfm, remarkInlineButtonChildren],
            rehypePlugins: [rehypeBootstrapTable]
        }),
        swc.vite({
            ...swcOptions,
            tsconfigFile: false
        }),
        vinext()
    ]
});
