import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Icon } from '../source/Icon';

export default {
    title: 'Example/Icon',
    component: Icon,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        name: { control: 'text' },
        size: { control: 'number' }
    }
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = args => <Icon {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
    name: '123'
};

export const SetSize = Template.bind({});
SetSize.args = {
    name: '123',
    size: 5
};

export const SetStyle = Template.bind({});
SetStyle.args = {
    name: '123',
    style: { color: 'red' }
};

export const SetClassName = Template.bind({});
SetClassName.args = {
    name: '123',
    className: 'bg-danger text-white'
};
