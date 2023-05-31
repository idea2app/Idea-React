import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { IdeaDialog } from '../source/IdeaDialog';

const meta: Meta<typeof IdeaDialog> = {
    title: 'Idea-React/IdeaDialog',
    component: IdeaDialog,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof IdeaDialog>;

export const Primary: Story = {
    render: ({ children, onCancel, ...otherArgs }) => {
        const [showDialog, setShowDialog] = useState(false);

        return (
            <>
                <button onClick={() => setShowDialog(true)}> view </button>
                <IdeaDialog
                    show={showDialog}
                    centered
                    onCancel={() => setShowDialog(false)}
                    {...otherArgs}
                >
                    {children}
                </IdeaDialog>
            </>
        );
    },
    args: {
        title: '查看',
        size: 'lg',
        confirmText: '确定',
        cancelText: '取消',
        children: <>Hello, Idea-React!</>
    }
};
