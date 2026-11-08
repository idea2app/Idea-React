import { FC } from 'react';

export type ExampleCodeProps = {
    code: string | string[];
    showMarkup?: boolean;
};

export const ExampleCode: FC<ExampleCodeProps> = ({ code, showMarkup = true }) => {
    const source = Array.isArray(code) ? code.join('') : code;
    const markup = source.replace(/\bclassName=/g, 'class=').replace(/\bhtmlFor=/g, 'for=');

    return (
        <figure>
            <div dangerouslySetInnerHTML={{ __html: markup }} />
            {showMarkup && (
                <pre>
                    <code>{source}</code>
                </pre>
            )}
        </figure>
    );
};

ExampleCode.displayName = 'ExampleCode';
