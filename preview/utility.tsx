import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism.min.css';

import { FC, HTMLAttributes, isValidElement, PropsWithChildren } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';

import { CodeBlock } from '../source';
import * as IdeaReact from '../source';

export const CodeExample: FC<PropsWithChildren> = ({ children }) => (
    <>
        {children}
        <CodeBlock language="tsx">{children}</CodeBlock>
    </>
);

// IdeaReact exports take priority over same-named ReactBootstrap exports
const liveScope: Record<string, unknown> = {
    ...ReactBootstrap,
    ...IdeaReact
};

export const LiveTSX: FC<PropsWithChildren> = ({ children }) => {
    const element = isValidElement(children) ? children : <>{children}</>;
    const code = typeof children === 'string' ? children : reactElementToJSXString(element);

    return (
        <LiveProvider code={code} scope={liveScope} language="tsx">
            <LivePreview className="mb-3" />
            <LiveEditor />
            <LiveError className="text-danger small p-2" />
        </LiveProvider>
    );
};

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
