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
    render: args => {
        const { title, onShow } = args;
        return (
            <IdeaPopover onShow={onShow} title={title}>
                <button>view</button>
                <>This is the content of popover.</>
            </IdeaPopover>
        );
    },
    args: {
        title: 'Popover Title',
        onShow: console.log
    }
};
