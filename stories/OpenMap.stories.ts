import type { Meta, StoryObj } from '@storybook/react';

import { OpenMap } from '../source/OpenMap';

const meta: Meta<typeof OpenMap> = {
    title: 'Idea-React/OpenMap',
    component: OpenMap,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof OpenMap>;

export const Primary: Story = {
    args: {
        center: [34.32, 108.55],
        zoom: 4
    }
};

export const Demo2: Story = {
    args: {
        zoom: 10,
        title: '天府之国',
        address: '成都市'
    }
};

export const Demo3: Story = {
    args: {
        center: [30.66, 104.06],
        zoom: 10,
        address: '成都市',
        onChange: console.log
    }
};
