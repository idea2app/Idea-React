import type { Meta, StoryObj } from '@storybook/react';

import { CodeBlock } from '../source/CodeBlock';

const meta: Meta<typeof CodeBlock> = {
    title: 'Idea-React/CodeBlock',
    component: CodeBlock,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof CodeBlock>;

export const Primary: Story = {
    render: args => {
        const { language, children } = args;
        return <CodeBlock language={language}>{children}</CodeBlock>;
    },
    args: {
        language: 'html',
        children: <button>Idea-React</button>
    }
};

export const Text: Story = {
    ...Primary,
    args: {
        language: 'text',
        children: <button>Idea-React</button>
    }
};
