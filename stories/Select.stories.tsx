import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Option, Select } from '../source/Select';

const meta: Meta<typeof Select> = {
    title: 'Idea-React/Select',
    component: Select,
    tags: ['autodocs'],
    argTypes: {
        className: { control: 'text' },
        style: { control: 'object' },
        value: { control: 'text' },
        children: { control: 'text' },
        variant: { control: 'text' },
        menuVariant: { control: 'text' }
    }
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Primary: Story = {
    render: ({ value, onChange, ...otherArgs }) => {
        const [selectValue, setValue] = useState<string>(value);
        return (
            <Select
                key="999999"
                value={selectValue}
                onChange={item => {
                    setValue(item);
                    onChange?.(item);
                }}
                {...otherArgs}
            >
                <Option value="0">idea2app/Idea-React</Option>
                <Option value="1">idea2app/event-submitter-polyfill</Option>
            </Select>
        );
    },
    args: {
        value: '0'
    }
};

export const Bigger: Story = {
    render: Primary.render,
    args: {
        ...Primary.args,
        className: 'fw-bolder'
    }
};
