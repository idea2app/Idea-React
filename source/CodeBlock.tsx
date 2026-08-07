import { FC, HTMLAttributes, isValidElement } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import js from 'shiki/langs/javascript.mjs';
import jsx from 'shiki/langs/jsx.mjs';
import ts from 'shiki/langs/typescript.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import githubLight from 'shiki/themes/github-light.mjs';

const highlighter = createHighlighterCoreSync({
    themes: [githubLight],
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
    const __html = highlighter.codeToHtml(sourceCode, { lang: language, theme: 'github-light', structure: 'inline' });

    return (
        <pre className={`language-${language} ${className}`} {...props}>
            <code dangerouslySetInnerHTML={{ __html }} className={`language-${language}`} />
        </pre>
    );
};
