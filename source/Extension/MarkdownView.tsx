import 'github-markdown-css/github-markdown.css';

import classNames from 'classnames';
import { marked } from 'marked';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';

export type MarkdownViewProps = Omit<
    ComponentPropsWithRef<'article'>,
    'children' | 'dangerouslySetInnerHTML'
> & {
    children: string;
};

export const MarkdownView = polymorphic<MarkdownViewProps>(
    ({ as: Root = 'article', className, children, ...props }) => (
        <Root
            {...props}
            className={classNames('markdown-body', className)}
            dangerouslySetInnerHTML={{ __html: marked.parse(children, { async: false }) }}
        />
    )
);
MarkdownView.displayName = 'MarkdownView';
