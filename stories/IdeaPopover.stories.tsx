import type { Meta, StoryObj } from '@storybook/react';

import { OverlayBox } from '../source/IdeaPopover';

const meta: Meta<typeof OverlayBox> = {
    title: 'Idea-React/OverlayBox',
    component: OverlayBox,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof OverlayBox>;

export const Tooltip: Story = {
    render: args => (
        <OverlayBox {...args}>
            <button>Tooltip</button>
        </OverlayBox>
    ),
    args: {
        title: 'Tooltip content',
        placement: 'bottom'
    }
};

export const Popover: Story = {
    render: args => (
        <OverlayBox {...args}>
            <button>Popover</button>
        </OverlayBox>
    ),
    args: {
        title: 'Popover Title',
        detail: 'This is the content of popover.',
        placement: 'bottom'
    }
};

export const PopoverClick: Story = {
    render: args => (
        <OverlayBox {...args}>
            <button>click to Popover</button>
        </OverlayBox>
    ),
    args: {
        title: 'Popover Title',
        detail: 'This is the content of popover.',
        placement: 'bottom',
        trigger: 'click'
    }
};
