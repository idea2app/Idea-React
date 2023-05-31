import type { Meta, StoryObj } from '@storybook/react';

import { ClickBoundary } from '../source/ClickBoundary';

const meta: Meta<typeof ClickBoundary> = {
    title: 'Idea-React/ClickBoundary',
    component: ClickBoundary,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof ClickBoundary>;

export const Primary: Story = {
    args: {
        className: 'bg-primary',
        children: 'Idea-React',
        onInnerClick: () => console.log('Click inner!'),
        onOuterClick: () => console.log('Click outer!')
    }
};
