import { OutputData } from '@editorjs/editorjs';
import createParser from 'editorjs-html';
import { HTMLAttributes } from 'react';

import { polymorphic } from '../Base/Polymorphic';

export const parser = createParser({
    link: ({ data: { link } }) => `<a href="${link}">${link}</a>`
});

export interface EditorHTMLProps extends HTMLAttributes<HTMLDivElement> {
    data: OutputData;
}

export const EditorHTML = polymorphic<EditorHTMLProps>(
    ({ as: Root = 'article', data, ...props }) => (
        <Root {...props} dangerouslySetInnerHTML={{ __html: parser.parse(data) }} />
    )
);
EditorHTML.displayName = 'EditorHTML';
