declare module '*.less' {
    const map: Record<string, string>;
    export = map;
}
declare module 'react-editor-js' {
    export const createReactEditorJS: () => any;
}
