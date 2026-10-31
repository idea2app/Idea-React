import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import swc from 'unplugin-swc';
import vinext from 'vinext';
import { defineConfig } from 'vite';

import { swcOptions } from '../swc.config.mts';

interface HastNode {
    type: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    children?: HastNode[];
}

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
        mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeBootstrapTable] }),
        swc.vite({
            ...swcOptions,
            tsconfigFile: false
        }),
        vinext()
    ]
});
