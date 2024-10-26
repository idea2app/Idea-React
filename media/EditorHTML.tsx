import { OutputData } from '@editorjs/editorjs';
import createParser from 'editorjs-html';
import { FC, PropsWithoutRef } from 'react';

export const parser = createParser({
    link: ({ data: { link } }: Record<string, any>) =>
        `<a href="${link}">${link}</a>`
});

export type EditorHTMLProps = PropsWithoutRef<{
    className?: string;
    data: OutputData;
}>;

export const EditorHTML: FC<EditorHTMLProps> = ({ className, data }) => {
    const __html = parser.parse(data).join('');

    return (
        <article dangerouslySetInnerHTML={{ __html }} className={className} />
    );
};

EditorHTML.displayName = 'EditorHTML';
