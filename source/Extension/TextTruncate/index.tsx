import { HTMLAttributes, ReactNode } from 'react';

import { polymorphic } from '../../Helper/Polymorphic';
import { TextTruncateContent } from './Content';

export interface TextTruncateProps extends HTMLAttributes<HTMLDivElement> {
    rows?: number;
    expandText?: ReactNode;
    collapseText?: ReactNode;
}

export const TextTruncate = polymorphic<TextTruncateProps>(
    ({
        as: Root = 'div',
        rows = 3,
        expandText = '⏬',
        collapseText = '⏫',
        children,
        ...props
    }) => (
        <Root {...props}>
            <TextTruncateContent rows={rows} expandText={expandText} collapseText={collapseText}>
                {children}
            </TextTruncateContent>
        </Root>
    )
);

TextTruncate.displayName = 'TextTruncate';
