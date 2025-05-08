import { OutputData } from '@editorjs/editorjs';
import createParser from 'editorjs-html';
import { FC, HTMLAttributes } from 'react';

export const parser = createParser({
    link: ({ data: { link } }: Record<string, any>) => `<a href="${link}">${link}</a>`
});

export interface EditorHTMLProps extends HTMLAttributes<HTMLDivElement> {
    data: OutputData;
}

export const EditorHTML: FC<EditorHTMLProps> = ({ data, ...props }) => (
    <article {...props} dangerouslySetInnerHTML={{ __html: parser.parse(data) }} />
);
EditorHTML.displayName = 'EditorHTML';
