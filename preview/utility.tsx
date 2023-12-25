import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

import { FC, HTMLAttributes, PropsWithChildren } from 'react';

import { CodeBlock } from '../source';

export const CodeExample: FC<PropsWithChildren> = ({ children }) => (
    <>
        {children}
        <CodeBlock language="tsx">{children}</CodeBlock>
    </>
);

export const Section: FC<HTMLAttributes<HTMLDivElement>> = ({
    className = '',
    title,
    children
}) => (
    <section className={`border bg-white mt-3 p-3 ${className}`}>
        <h2 className="h3" id={title}>
            {title}
        </h2>

        {children}
    </section>
);
