import { ComponentProps, FC, isValidElement, PropsWithChildren, ReactNode } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';

import { Card } from '../../../source/Base/Card';
import { CodeBlock } from '../../../source/Extension/CodeBlock';
import { LiveRunner } from './LiveRunner';

const CLIENT_REFERENCE_TAG = Symbol.for('react.client.reference');
const WRAPPED_TAGS = new Set([Symbol.for('react.memo'), Symbol.for('react.forward_ref')]);
const REPOSITORY_SOURCE_BASE = 'https://github.com/idea2app/Idea-React/blob/main/';

interface ComponentType {
    displayName?: string;
    name?: string;
    $$typeof?: symbol;
    $$id?: string;
    type?: ComponentType;
    render?: ComponentType;
}

const getTypeName = (type: ComponentType): string | undefined => {
    if (type.displayName) return type.displayName;

    if (type.$$typeof === CLIENT_REFERENCE_TAG) return type.$$id?.split('#').pop();

    if (WRAPPED_TAGS.has(type.$$typeof!)) return getTypeName((type.type ?? type.render)!);

    if (type.name && type.name !== '_default') return type.name;
};

const getDisplayName = (node: ReactNode): string => {
    if (!isValidElement(node)) return 'UnknownElementType';

    const { type } = node;

    return typeof type === 'string'
        ? type
        : (getTypeName(type as ComponentType) ?? 'UnknownElementType');
};

const toSourceCode = (children: ReactNode) => {
    const element = isValidElement(children) ? children : <>{children}</>;

    return reactElementToJSXString(element, {
        displayName: getDisplayName,
        filterProps: (value: unknown) => value !== undefined
    });
};

export type CodeExampleProps = PropsWithChildren<{
    code?: string;
    source?: string;
}>;

export type CodeCardProps = CodeExampleProps & {
    language?: string;
};

export type LiveExampleProps = PropsWithChildren<{
    code?: string;
}>;

const getSourceURL = (source: string) => new URL(source, REPOSITORY_SOURCE_BASE).href;

export const CodeCard: FC<CodeCardProps> = ({ children, code, language = 'tsx', source }) => (
    <Card className="my-6" body>
        <CodeBlock
            language={language}
            header={
                source && (
                    <a href={getSourceURL(source)} target="_blank" rel="noreferrer">
                        {source}
                    </a>
                )
            }
        >
            {code ?? (typeof children === 'string' ? children : toSourceCode(children))}
        </CodeBlock>
    </Card>
);

export const DocumentCodeFence: FC<ComponentProps<'pre'>> = ({ children, ...props }) => {
    if (!isValidElement<ComponentProps<'code'>>(children) || children.type !== 'code')
        return <pre {...props}>{children}</pre>;

    const { className = '', children: code } = children.props;
    const language = className.replace(/^language-/, '') || 'text';

    return <CodeCard language={language}>{code}</CodeCard>;
};

export const CodeExample: FC<CodeExampleProps> = ({ code, source, children }) => (
    <>
        {children}
        <CodeCard source={source}>{code ?? children}</CodeCard>
    </>
);

export const LiveExample: FC<LiveExampleProps> = ({ code, children }) => (
    <LiveRunner code={code ?? toSourceCode(children)} />
);
