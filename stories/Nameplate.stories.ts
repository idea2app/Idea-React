import type { Meta, StoryObj } from '@storybook/react';

import { Nameplate } from '../source/Nameplate';

import defaultURL from './assets/default-avatar.png';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Nameplate> = {
    title: 'Idea-React/Nameplate',
    component: Nameplate,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Nameplate>;

export const Primary: Story = {
    args: {
        avatar: defaultURL,
        name: 'Alice'
    }
};
