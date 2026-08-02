import { FC, isValidElement } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

export type LiveTSXProps = Pick<Parameters<typeof LiveProvider>[0], 'scope' | 'children'>;

export const LiveTSX: FC<LiveTSXProps> = ({ scope, children }) => {
    const element = isValidElement(children) ? children : <>{children}</>;
    const code = typeof children === 'string' ? children : reactElementToJSXString(element);

    return (
        <LiveProvider code={code} scope={scope} language="tsx">
            <LivePreview className="mb-3" />
            <LiveEditor />
            <LiveError className="text-danger small p-2" />
        </LiveProvider>
    );
};
