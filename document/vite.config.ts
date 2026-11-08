import { fileURLToPath } from 'node:url';

import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import swc from 'unplugin-swc';
import vinext from 'vinext';
import { defineConfig } from 'vite';

import { swcOptions } from '../swc.config.mts';
import { documentationSearch } from './search/index.ts';

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

const upstreamPaths: Record<string, string> = {
    'components/chips': 'forms/chips',
    'components/grid': 'layout/grid',
    'components/image': 'content/images',
    'components/table': 'content/tables',
    forms: 'forms/overview'
};

const remarkDocumentationHeading = () => (tree: MdastNode, file: { path: string }) => {
    const route =
        file.path
            .replaceAll('\\', '/')
            .split('/app/')[1]
            ?.replace(/\/?page\.mdx$/, '') ?? '';
    const page = route.replace(/\/$/, '');
    const upstream =
        upstreamPaths[page] ??
        (/^(components|forms)\/[^/]+$/.test(page) ? page : 'getting-started/install');
    const visit = (node: MdastNode) => {
        if ((node.type === 'heading' && node.depth === 1) || node.name === 'h1') {
            node.type = 'mdxJsxFlowElement';
            node.name = 'DocumentationHeading';
            node.attributes = [
                ...(node.attributes ?? []),
                { type: 'mdxJsxAttribute', name: 'upstreamPath', value: `${upstream}/` }
            ];
        }
        node.children?.forEach(visit);
    };
    visit(tree);
};

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

const remarkCodeCards = () => (tree: MdastNode) => {
    const visit = (node: MdastNode) => {
        if (!node.children) return;

        node.children = node.children.map(child => {
            if (child.type === 'code')
                return {
                    type: 'mdxJsxFlowElement',
                    name: 'CodeCard',
                    attributes: [
                        {
                            type: 'mdxJsxAttribute',
                            name: 'language',
                            value: child.lang ?? 'text'
                        },
                        {
                            type: 'mdxJsxAttribute',
                            name: 'code',
                            value: child.value ?? ''
                        }
                    ]
                };
            visit(child);
            return child;
        });
    };
    visit(tree);
};

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
    resolve: {
        alias: {
            '@documentation/MDXComponents': fileURLToPath(
                new URL('./component/Documentation/MDXComponents.tsx', import.meta.url)
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
            providerImportSource: '@documentation/MDXComponents',
            remarkPlugins: [
                remarkGfm,
                remarkDocumentationHeading,
                remarkCodeCards,
                remarkInlineButtonChildren
            ],
            rehypePlugins: [rehypeBootstrapTable]
        }),
        swc.vite({
            ...swcOptions,
            tsconfigFile: false
        }),
        vinext()
    ]
});
