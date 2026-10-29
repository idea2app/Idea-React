import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Menu, MenuItem } from '../source/Menu';

const items = (
    <>
        <MenuItem href="/docs">Docs</MenuItem>
        <MenuItem disabled>Disabled</MenuItem>
        <MenuItem>Action</MenuItem>
    </>
);

it('toggles with a real button and closes on selection or outside interaction', () => {
    const onOpenChange = mock.fn();
    const { container } = render(
        <Menu id="example" label="Explore" onOpenChange={onOpenChange}>
            {items}
        </Menu>
    );
    const trigger = screen.getByRole('button', { name: 'Explore' });
    assert.equal(trigger.getAttribute('aria-controls'), 'example-menu');
    fireEvent.click(trigger);
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');
    assert.equal(container.querySelector('.menu')?.classList.contains('show'), true);
    fireEvent.click(screen.getByRole('button', { name: 'Action' }));
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    assert.deepEqual(
        onOpenChange.mock.calls.map(({ arguments: [open] }) => open),
        [true, false, true, false]
    );
});

it('supports keyboard navigation, skips disabled items and restores focus on Escape', async () => {
    render(<Menu label="Explore">{items}</Menu>);
    const trigger = screen.getByRole('button', { name: 'Explore' });
    await act(async () => {
        fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    });
    assert.equal(document.activeElement, screen.getByRole('link', { name: 'Docs' }));
    await act(async () => {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    });
    assert.equal(document.activeElement, screen.getByRole('button', { name: 'Action' }));
    await act(async () => {
        fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    });
    assert.equal(document.activeElement, screen.getByRole('link', { name: 'Docs' }));
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    assert.equal(document.activeElement, trigger);
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
});

it('honors outside-only and disabled auto-close and removes document listeners', t => {
    const remove = t.mock.method(document, 'removeEventListener');
    const { rerender, unmount } = render(
        <Menu label="Explore" autoClose="outside">
            {items}
        </Menu>
    );
    const trigger = screen.getByRole('button', { name: 'Explore' });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Action' }));
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');
    rerender(
        <Menu label="Explore" autoClose={false}>
            {items}
        </Menu>
    );
    fireEvent.pointerDown(document.body);
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');
    unmount();
    assert.ok(
        remove.mock.calls.some(
            ({ arguments: [type, listener] }) =>
                type === 'pointerdown' && typeof listener === 'function'
        )
    );
});
