import { FC, HTMLAttributes, ReactNode } from 'react';

import { TextTruncateContent } from './Content';

export interface TextTruncateProps extends HTMLAttributes<HTMLDivElement> {
    rows?: number;
    expandText?: ReactNode;
    collapseText?: ReactNode;
}

export const TextTruncate: FC<TextTruncateProps> = ({
    rows = 3,
    expandText = '⏬',
    collapseText = '⏫',
    children,
    ...props
}) => (
    <div {...props}>
        <TextTruncateContent rows={rows} expandText={expandText} collapseText={collapseText}>
            {children}
        </TextTruncateContent>
    </div>
);

TextTruncate.displayName = 'TextTruncate';
