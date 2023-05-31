import { highlight, languages } from 'prismjs';
import { PropsWithChildren } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';

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
