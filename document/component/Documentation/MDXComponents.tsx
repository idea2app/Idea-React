import { CodeCard } from './Components/Example';
import { DocumentationHeading } from './Heading';

export const useMDXComponents = (components = {}) => ({
    CodeCard,
    DocumentationHeading,
    ...components
});
