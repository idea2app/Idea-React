import { Table, TableProps } from '../../../source/Content/Tables';
import { CodeCard, DocumentCodeFence } from './Example';

const MDXTable = (props: TableProps) => <Table {...props} responsive />;

export const useMDXComponents = (components = {}) => ({
    CodeCard,
    table: MDXTable,
    pre: DocumentCodeFence,
    ...components
});
