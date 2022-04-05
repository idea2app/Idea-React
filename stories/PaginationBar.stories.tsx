import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PaginationBar } from '../source/PaginationBar';

export default {
    title: 'Example/PaginationBar',
    component: PaginationBar,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        total: { control: 'number' },
        current: { control: 'number' },
        pathResolver: { action: 'clicked' }
    }
} as ComponentMeta<typeof PaginationBar>;

const Template: ComponentStory<typeof PaginationBar> = args => (
    <PaginationBar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    total: 5,
    current: 1
};

export const SecondPage = Template.bind({});
SecondPage.args = {
    total: 5,
    current: 2
};
