import type { Meta, StoryObj } from '@storybook/react';

import { TimeDistance } from '../source/TimeDistance';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof TimeDistance> = {
    title: 'Idea-React/TimeDistance',
    component: TimeDistance,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TimeDistance>;

export const Primary: Story = {
    args: {
        date: '1989-06-04'
    }
};

export const FutureTime: Story = {
    args: {
        date: '2075-02-19'
    }
};

export const UnitWords: Story = {
    args: {
        date: '1970-01-01',
        unitWords: {
            ms: '毫秒',
            s: '秒',
            m: '分钟',
            H: '小时',
            D: '天',
            W: '周',
            M: '月',
            Y: '年'
        }
    }
};

export const BeforeWord: Story = {
    args: {
        date: '1970-01-01',
        beforeWord: ' ago'
    }
};

export const AfterWord: Story = {
    args: {
        date: '2075-02-19',
        afterWord: ' 后'
    }
};

export const ClassName: Story = {
    args: {
        date: '2075-02-19',
        className: 'text-danger'
    }
};
