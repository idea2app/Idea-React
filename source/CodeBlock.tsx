import js from '@shikijs/langs/javascript';
import jsx from '@shikijs/langs/jsx';
import tsx from '@shikijs/langs/tsx';
import ts from '@shikijs/langs/typescript';
import githubDark from '@shikijs/themes/github-dark';
import githubLight from '@shikijs/themes/github-light';
import { FC, HTMLAttributes, isValidElement } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const highlighter = createHighlighterCoreSync({
    themes: [githubLight, githubDark],
    langs: [js, jsx, ts, tsx],
    engine: createJavaScriptRegexEngine()
});

export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
    language: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({ className = '', language, children, ...props }) => {
    const sourceCode =
        typeof children === 'string'
            ? children
            : reactElementToJSXString(isValidElement(children) ? children : <>{children}</>);

    const __html = highlighter.codeToHtml(sourceCode, {
        lang: language,
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: 'light',
        structure: 'inline'
    });

    return (
        <pre className={`m-0 shiki language-${language} ${className}`} {...props}>
            <code dangerouslySetInnerHTML={{ __html }} className={`language-${language}`} />
        </pre>
    );
};
