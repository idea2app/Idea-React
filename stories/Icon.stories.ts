import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from '../source/Icon';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Icon> = {
    title: 'Idea-React/Icon',
    component: Icon,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Primary: Story = {
    args: {
        name: 'bootstrap'
    }
};

export const Bigger: Story = {
    args: {
        ...Primary.args,
        size: 5
    }
};

export const Smaller: Story = {
    args: {
        ...Primary.args,
        size: 0.5
    }
};

export const WithClass: Story = {
    args: {
        ...Primary.args,
        size: 2,
        className: 'shadow'
    }
};

export const WithStyle: Story = {
    args: {
        ...Primary.args,
        style: { border: '4px double #32a1ce' }
    }
};
