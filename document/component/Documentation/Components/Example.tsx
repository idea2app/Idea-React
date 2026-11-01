import { FC, isValidElement, PropsWithChildren, ReactNode } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';

import { Card, CardBody } from '../../../../source/Card';
import { CodeBlock } from '../../../../source/CodeBlock';
import { LiveRunner } from './LiveRunner';

const CLIENT_REFERENCE_TAG = Symbol.for('react.client.reference');
const WRAPPED_TAGS = new Set([Symbol.for('react.memo'), Symbol.for('react.forward_ref')]);

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

    return reactElementToJSXString(element, { displayName: getDisplayName });
};

export interface CodeExampleProps extends PropsWithChildren {
    code?: string;
}

export interface LiveExampleProps extends PropsWithChildren {
    code?: string;
}

export const CodeCard: FC<PropsWithChildren> = ({ children }) => (
    <Card className="mt-3">
        <CardBody>
            <CodeBlock language="tsx">
                {typeof children === 'string' ? children : toSourceCode(children)}
            </CodeBlock>
        </CardBody>
    </Card>
);

export const CodeExample: FC<CodeExampleProps> = ({ code, children }) => (
    <>
        {children}
        <CodeCard>{code ?? children}</CodeCard>
    </>
);

export const LiveExample: FC<LiveExampleProps> = ({ code, children }) => (
    <LiveRunner code={code ?? toSourceCode(children)} />
);
