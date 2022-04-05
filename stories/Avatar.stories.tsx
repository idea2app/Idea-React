import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Avatar } from '../source/Avatar';

export default {
    title: 'Example/Avatar',
    component: Avatar
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = args => <Avatar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    src: 'https://via.placeholder.com/150/92c952'
};

export const SetSizeSmaller = Template.bind({});
SetSizeSmaller.args = {
    src: 'https://via.placeholder.com/150/92c952',
    size: 1
};

export const SetSizeBigger = Template.bind({});
SetSizeBigger.args = {
    src: 'https://via.placeholder.com/150/92c952',
    size: 5
};

export const SetStyle = Template.bind({});
SetStyle.args = {
    src: 'https://via.placeholder.com/150/92c952',
    style: {}
};
