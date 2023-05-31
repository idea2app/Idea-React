import EditorJS_HTML from 'editorjs-html';
import { FC, PropsWithoutRef } from 'react';

export const parser = new EditorJS_HTML({
    link: ({ data: { link } }: Record<string, any>) =>
        `<a href="${link}">${link}</a>`
});

export type EditorHTMLProps = PropsWithoutRef<{
    className?: string;
    data: string;
}>;

export const EditorHTML: FC<EditorHTMLProps> = ({ className, data }) => {
    const __html = parser.parse(JSON.parse(data)).join('');

    return (
        <article className={className} dangerouslySetInnerHTML={{ __html }} />
    );
};

EditorHTML.displayName = 'EditorHTML';
