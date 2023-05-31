import type { Meta, StoryObj } from '@storybook/react';

import { TypeEcho } from '../source/TypeEcho';

const meta: Meta<typeof TypeEcho> = {
    title: 'Idea-React/TypeEcho',
    component: TypeEcho,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TypeEcho>;

export const Primary: Story = {
    args: {
        text: 'Welcome to Idea-React!'
    }
};

export const Slowly: Story = {
    args: {
        ...Primary.args,
        intervals: 500
    }
};

export const Quickly: Story = {
    args: {
        ...Primary.args,
        intervals: 30
    }
};

export const WithClass: Story = {
    args: {
        ...Primary.args,
        className: 'text-danger'
    }
};
