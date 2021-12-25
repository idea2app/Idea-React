declare module '*.less' {
    const map: Record<string, string>;
    export = map;
}
declare module 'react-editor-js' {
    export const createReactEditorJS: () => any;
}
declare module 'editorjs-html' {
    export default class Parser {
        constructor(...data: any[]);
        parse(data: any);
    }
}
