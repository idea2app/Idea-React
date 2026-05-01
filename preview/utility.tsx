import { FC, HTMLAttributes, PropsWithChildren } from 'react';
import * as ReactBootstrap from 'react-bootstrap';

import * as IdeaReact from '../source';
import { CodeBlock, LiveTSX } from '../source';

export const CodeExample: FC<PropsWithChildren> = ({ children }) => (
    <>
        <link
            rel="stylesheet"
            href="https://unpkg.com/prismjs@1.30.0/themes/prism.min.css"
            precedence="default"
        />
        {children}
        <CodeBlock language="tsx">{children}</CodeBlock>
    </>
);

export const LiveExample: FC<PropsWithChildren> = ({ children }) => (
    <LiveTSX scope={{ ...ReactBootstrap, ...IdeaReact }}>{children}</LiveTSX>
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
