import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Drawer } from '../source/Drawer';

it('renders a Bootstrap 6 drawer without dialog styles and dismisses from its close button', () => {
    const onDismiss = mock.fn();
    render(
        <Drawer title="Menu" placement="start" bodyClassName="mb-2" open onDismiss={onDismiss}>
            <p>Drawer content</p>
        </Drawer>
    );
    const drawer = screen.getByRole('dialog', { name: 'Menu' });

    assert.equal(drawer.className, 'drawer drawer-start');
    assert.equal(drawer.getAttribute('tabindex'), '-1');
    assert.equal((drawer as HTMLDialogElement).open, true);
    assert.equal(screen.getByText('Drawer content').parentElement?.className, 'drawer-body mb-2');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    assert.equal(onDismiss.mock.callCount(), 1);
});

it('supports a dark color mode and footer content', () => {
    render(
        <Drawer title="Menu" theme="dark" footer={<button type="button">Done</button>} open>
            Content
        </Drawer>
    );
    const drawer = screen.getByRole('dialog', { name: 'Menu' });

    assert.equal(drawer.dataset.bsTheme, 'dark');
    assert.equal(
        screen.getByRole('button', { name: 'Done' }).parentElement?.className,
        'drawer-footer'
    );
});
