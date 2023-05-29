import type { Meta, StoryObj } from '@storybook/react';

import { SpinnerButton } from '../source/SpinnerButton';

const meta: Meta<typeof SpinnerButton> = {
    title: 'Idea-React/SpinnerButton',
    component: SpinnerButton,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        animation: { control: 'select', options: ['border', 'grow'] }
    },
    args: {
        animation: 'border'
    }
};

export default meta;

type Story = StoryObj<typeof SpinnerButton>;

export const Primary: Story = {
    args: {
        children: 'Idea-React',
        onClick: () => console.log('Hello, Idea-React!')
    }
};

export const Loading: Story = {
    args: {
        ...Primary.args,
        loading: true
    }
};

export const GrowLoading: Story = {
    args: {
        ...Primary.args,
        loading: true,
        animation: 'grow'
    }
};

export const Disabled: Story = {
    args: {
        ...Primary.args,
        disabled: true
    }
};
