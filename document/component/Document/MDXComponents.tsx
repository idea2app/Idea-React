import { DocumentCodeCard, DocumentCodeFence } from './Example';
import { DocumentHeading } from './Heading';

export const useMDXComponents = (components = {}) => ({
    DocumentCodeCard,
    h1: DocumentHeading,
    pre: DocumentCodeFence,
    ...components
});
