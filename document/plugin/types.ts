import { ESTree } from 'vite';

export interface MdastNode {
    type: string;
    name?: string | null;
    lang?: string | null;
    value?: string;
    depth?: number;
    attributes?: {
        type: string;
        name: string;
        value:
            | string
            | {
                  type: string;
                  value: string;
                  data: { estree: ESTree.Program };
              };
    }[];
    // eslint-disable-next-line no-restricted-syntax -- AST children are not component props.
    children?: MdastNode[];
}
