import { highlight, languages } from 'prismjs';
import { FC, HTMLAttributes, isValidElement } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';

export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
    language: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({ className = '', language, children, ...props }) => {
    const sourceCode =
        typeof children === 'string'
            ? children
            : reactElementToJSXString(isValidElement(children) ? children : <>{children}</>);
    const __html = highlight(sourceCode, languages[language], language);

    return (
        <pre className={`language-${language} ${className}`} {...props}>
            <code dangerouslySetInnerHTML={{ __html }} className={`language-${language}`} />
        </pre>
    );
};
