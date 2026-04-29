import { FC, HTMLAttributes, isValidElement, PropsWithChildren } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';

import * as IdeaReact from '../source';

const liveScope: Record<string, unknown> = {
    ...ReactBootstrap,
    ...IdeaReact
};

export const CodeExample: FC<PropsWithChildren> = ({ children }) => {
    const code =
        typeof children === 'string'
            ? children
            : reactElementToJSXString(isValidElement(children) ? children : <>{children}</>);

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
