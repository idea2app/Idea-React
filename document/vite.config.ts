import { fileURLToPath } from 'node:url';

import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import swc from 'unplugin-swc';
import { unrun } from 'unrun';
import vinext from 'vinext';
import { defineConfig } from 'vite';

import { swcOptions } from '../swc.config.mts';

interface MdastNode {
    type: string;
    name?: string | null;
    lang?: string | null;
    value?: string;
    depth?: number;
    attributes?: MdastNode[];
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
    'DocumentCarouselImage',
    'ChipDismiss',
    'ChipInputLabel',
    'ChipToken',
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
    'Option',
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

export default defineConfig(async () => {
    const {
        module: { documentationSearch }
    } = await unrun<typeof import('./search/index.tsx')>({
        path: new URL('./search/index.tsx', import.meta.url),
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
            documentationSearch(),
            mdx({
                providerImportSource: '@document/MDXComponents',
                remarkPlugins: [remarkGfm, remarkInlineButtonChildren],
                rehypePlugins: [rehypeBootstrapTable]
            }),
            swc.vite({
                ...swcOptions,
                tsconfigFile: false
            }),
            vinext()
        ]
    };
});
