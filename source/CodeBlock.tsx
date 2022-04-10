import React, { PropsWithChildren } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { highlight, languages } from 'prismjs';

export type CodeBlockProps = PropsWithChildren<{ language: string }>;

export function CodeBlock({ language, children }: CodeBlockProps) {
    const __html = highlight(
        reactElementToJSXString(children),
        languages[language],
        language
    );

    return (
        <pre>
            <code
                className={`language-${language}`}
                dangerouslySetInnerHTML={{ __html }}
            />
        </pre>
    );
}
