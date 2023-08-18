declare module '*.less' {
    const map: Record<string, string>;
    export = map;
}
declare module '*.png' {
    const path: string;
    export default path;
}
