import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '../source/Avatar';

import defaultURL from './assets/default-avatar.png';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Avatar> = {
    title: 'Idea-React/Avatar',
    component: Avatar,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        style: { control: 'object' },
        className: { control: 'text' },
        src: { control: 'text' },
        size: { type: 'number' }
    }
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Primary: Story = {
    // More on args: https://storybook.js.org/docs/react/writing-stories/args
    args: {
        src: defaultURL
    }
};

export const Bigger: Story = {
    args: {
        ...Primary.args,
        size: 5
    }
};

export const WithClass: Story = {
    args: {
        ...Primary.args,
        className: 'shadow'
    }
};

export const WithStyle: Story = {
    args: {
        ...Primary.args,
        style: { border: '4px double #32a1ce' }
    }
};
