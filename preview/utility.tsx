import { FC, HTMLAttributes, PropsWithChildren } from 'react';
import * as ReactBootstrap from 'react-bootstrap';

import * as IdeaReact from '../source';
import { CodeBlock, LiveTSX } from '../source';

export const CodeCard: FC<PropsWithChildren> = ({ children }) => (
    <ReactBootstrap.Card className="mt-3" body>
        <CodeBlock language="tsx">{children}</CodeBlock>
    </ReactBootstrap.Card>
);

export const CodeExample: FC<PropsWithChildren> = ({ children }) => (
    <>
        {children}
        <CodeCard>{children}</CodeCard>
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
