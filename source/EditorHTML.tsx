import React, { PropsWithoutRef } from 'react';
import EditorJS_HTML from 'editorjs-html';

export const parser = new EditorJS_HTML({
    link: ({ data: { link } }: Record<string, any>) =>
        `<a href="${link}">${link}</a>`
});

export type EditorHTMLProps = PropsWithoutRef<{
    className?: string;
    data: string;
}>;

export function EditorHTML({ className, data }: EditorHTMLProps) {
    const __html = parser.parse(JSON.parse(data)).join('');

    return (
        <article className={className} dangerouslySetInnerHTML={{ __html }} />
    );
}
