import { createHash } from 'node:crypto';

import { renderMermaidSVG } from 'beautiful-mermaid';
import { parseSync } from 'vite';

import { MdastNode } from './types';

export const remarkMermaid =
    () =>
    (tree: MdastNode, { path }: { path?: string }) => {
        let index = 0;

        const render = (node: MdastNode): MdastNode => {
            if (node.type !== 'code' || node.lang !== 'mermaid') {
                if (node.children) node.children = node.children.map(render);

                return node;
            }
            if (typeof node.value !== 'string')
                throw new TypeError('Mermaid source must be a string.');

            const title = node.value.match(/^[ \t]*accTitle:[ \t]*(.+)$/m)?.[1];
            const description = node.value.match(/^[ \t]*accDescr:[ \t]*(.+)$/m)?.[1];
            const source = node.value.replace(
                /^[ \t]*acc(?:Title|Descr):[^\r\n]*(?:\r?\n|$)/gm,
                ''
            );
            const hash = createHash('sha256')
                .update(`${path}:${index++}`)
                .digest('hex')
                .slice(0, 12);
            const id = `mermaid-${hash}`;
            const svg = renderMermaidSVG(source, {
                bg: 'var(--bs-bg-body)',
                fg: 'var(--bs-fg-body)',
                font: 'Arial',
                padding: 12,
                nodeSpacing: 16,
                transparent: true
            })
                .replace(/\sid="([^"]+)"/g, (_, name: string) => ` id="${id}-${name}"`)
                .replace(/url\(#([^)]+)\)/g, (_, name: string) => `url(#${id}-${name})`)
                .replace('<svg ', `<svg id="${id}" aria-hidden="true" `)
                .replace(/<style>([\s\S]*?)<\/style>/g, (_, css: string) => {
                    const scoped = css
                        .replace(/@import\s+url\([^)]*\);/g, '')
                        .replace(/\btext\s*\{/g, `#${id} text {`)
                        .replace(/\.mono\s*\{/g, `#${id} .mono {`)
                        .replace(/\bsvg\s*\{/g, `#${id} {`);

                    return `<style>${scoped}</style>`;
                });
            const expression = `({ __html: ${JSON.stringify(svg)} })`;
            const { program, errors } = parseSync('mermaid.js', expression, {
                preserveParens: false
            });
            if (errors.length) throw new Error(errors.map(({ message }) => message).join('\n'));

            const styleExpression = "({ marginBlock: '1.25rem', overflowX: 'auto' })";
            const { program: style, errors: styleErrors } = parseSync(
                'mermaid-style.js',
                styleExpression,
                { preserveParens: false }
            );
            if (styleErrors.length)
                throw new Error(styleErrors.map(({ message }) => message).join('\n'));

            const attributes: NonNullable<MdastNode['attributes']> = [
                {
                    type: 'mdxJsxAttribute',
                    name: 'style',
                    value: {
                        type: 'mdxJsxAttributeValueExpression',
                        value: styleExpression,
                        data: { estree: style }
                    }
                },
                { type: 'mdxJsxAttribute', name: 'role', value: 'img' },
                { type: 'mdxJsxAttribute', name: 'aria-label', value: title ?? 'Mermaid diagram' },
                {
                    type: 'mdxJsxAttribute',
                    name: 'dangerouslySetInnerHTML',
                    value: {
                        type: 'mdxJsxAttributeValueExpression',
                        value: expression,
                        data: { estree: program }
                    }
                }
            ];
            if (description)
                attributes.push({
                    type: 'mdxJsxAttribute',
                    name: 'aria-description',
                    value: description
                });

            return { type: 'mdxJsxFlowElement', name: 'div', attributes, children: [] };
        };

        render(tree);
    };
