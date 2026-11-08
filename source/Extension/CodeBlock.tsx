import css from '@shikijs/langs/css';
import html from '@shikijs/langs/html';
import js from '@shikijs/langs/javascript';
import json from '@shikijs/langs/json';
import jsx from '@shikijs/langs/jsx';
import sh from '@shikijs/langs/sh';
import tsx from '@shikijs/langs/tsx';
import ts from '@shikijs/langs/typescript';
import githubDark from '@shikijs/themes/github-dark';
import githubLight from '@shikijs/themes/github-light';
import { HTMLAttributes, isValidElement, ReactNode } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { createHighlighterCoreSync, ShikiTransformer } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

import { polymorphic } from '../Base/Polymorphic';

const highlighter = createHighlighterCoreSync({
    themes: [githubLight, githubDark],
    langs: [css, html, js, json, jsx, sh, ts, tsx],
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

        const span: ShikiTransformer['span'] = ({ properties }) => {
            properties.style = `${properties.style};color:light-dark(var(--shiki-light),var(--shiki-dark))`;
        };
        const __html = highlighter.codeToHtml(sourceCode, {
            lang: language,
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false,
            structure: 'inline',
            transformers: [{ span }]
        });
        const code = (
            <Root className={`m-0 shiki language-${language} ${className}`} {...props}>
                <code dangerouslySetInnerHTML={{ __html }} className={`language-${language}`} />
            </Root>
        );

        return header ? (
            <figure className="m-0">
                <figcaption className="px-3 pb-6 mb-6 bg-body-tertiary border-bottom">
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
