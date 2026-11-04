import { CodeCard } from './Components/Example';

export const useMDXComponents = (components = {}) => ({
    CodeCard,
    ...components
});
