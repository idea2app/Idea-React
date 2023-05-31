import type { Meta, StoryObj } from '@storybook/react';

import { Loading } from '../source/Loading';

const meta: Meta<typeof Loading> = {
    title: 'Idea-React/Loading',
    component: Loading,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const Primary: Story = {};

export const CustomChildren: Story = {
    args: {
        children: 'Hi, this is custom content!'
    }
};
