import js from '@shikijs/langs/javascript';
import jsx from '@shikijs/langs/jsx';
import tsx from '@shikijs/langs/tsx';
import ts from '@shikijs/langs/typescript';
import githubDark from '@shikijs/themes/github-dark';
import githubLight from '@shikijs/themes/github-light';
import { HTMLAttributes, isValidElement, ReactNode } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

import { polymorphic } from '../Polymorphic';

const highlighter = createHighlighterCoreSync({
    themes: [githubLight, githubDark],
    langs: [js, jsx, ts, tsx],
    engine: createJavaScriptRegexEngine()
});

export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
    language: string;
    header?: ReactNode;
}

export const CodeBlock = polymorphic<CodeBlockProps>(
    ({ as: Root = 'pre', className = '', language, header, children, ...props }) => {
        const sourceCode =
            typeof children === 'string'
                ? children
                : reactElementToJSXString(isValidElement(children) ? children : <>{children}</>);

        const __html = highlighter.codeToHtml(sourceCode, {
            lang: language,
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false,
            structure: 'inline',
            transformers: [
                {
                    span({ properties }) {
                        properties.style = `${properties.style};color:light-dark(var(--shiki-light),var(--shiki-dark))`;
                    }
                }
            ]
        });

        const code = (
            <Root className={`m-0 shiki language-${language} ${className}`} {...props}>
                <code dangerouslySetInnerHTML={{ __html }} className={`language-${language}`} />
            </Root>
        );

        return header ? (
            <figure className="m-0 border rounded overflow-hidden">
                <figcaption className="px-3 py-2 bg-body-tertiary border-bottom">
                    {header}
                </figcaption>
                {code}
            </figure>
        ) : (
            code
        );
    }
);

CodeBlock.displayName = 'CodeBlock';
