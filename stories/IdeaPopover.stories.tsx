import type { Meta, StoryObj } from '@storybook/react';

import { IdeaPopover } from '../source/IdeaPopover';

const meta: Meta<typeof IdeaPopover> = {
    title: 'Idea-React/IdeaPopover',
    component: IdeaPopover,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof IdeaPopover>;

export const Primary: Story = {
    render: args => (
        <IdeaPopover {...args}>
            <button>view</button>
            This is the content of popover.
        </IdeaPopover>
    ),
    args: {
        title: 'Popover Title',
        onShow: console.log
    }
};
