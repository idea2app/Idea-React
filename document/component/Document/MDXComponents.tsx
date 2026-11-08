import { DocumentCodeCard, DocumentCodeFence } from './Example';

export const useMDXComponents = (components = {}) => ({
    DocumentCodeCard,
    pre: DocumentCodeFence,
    ...components
});
