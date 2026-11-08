import { CodeCard, DocumentCodeFence } from './Example';

export const useMDXComponents = (components = {}) => ({
    CodeCard,
    pre: DocumentCodeFence,
    ...components
});
