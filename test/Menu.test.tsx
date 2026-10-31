import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';

import {
    Menu,
    MenuDivider,
    MenuHeader,
    MenuItem,
    MenuItemContent,
    MenuItemDescription,
    MenuPanel,
    MenuSubmenu,
    MenuText
} from '../source/Menu';

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
    await act(() => fireEvent.keyDown(trigger, { key: 'ArrowDown' }));
    assert.equal(document.activeElement, screen.getByRole('link', { name: 'Docs' }));

    await act(() => fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' }));
    assert.equal(document.activeElement, screen.getByRole('button', { name: 'Action' }));

    await act(() => fireEvent.keyDown(document.activeElement!, { key: 'Home' }));
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

it('closes on Tab and safely handles an empty menu during keyboard navigation', async () => {
    render(<Menu label="Empty" />);

    const trigger = screen.getByRole('button', { name: 'Empty' });
    await act(() => fireEvent.keyDown(trigger, { key: 'ArrowDown' }));
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');

    fireEvent.keyDown(trigger, { key: 'Tab' });
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    assert.deepEqual(new Menu({ label: 'Unmounted' }).items(), []);
});

it('renders menu content parts with Bootstrap 6 classes', () => {
    const { container } = render(
        <MenuPanel className="show position-static">
            <MenuHeader>Menu header</MenuHeader>
            <MenuText>Menu item text</MenuText>
            <MenuItem>
                <MenuItemContent>
                    Publish now
                    <MenuItemDescription>Make this page visible immediately</MenuItemDescription>
                </MenuItemContent>
            </MenuItem>
            <MenuDivider />
        </MenuPanel>
    );

    assert.equal(container.firstElementChild?.className, 'menu show position-static');
    assert.equal(screen.getByRole('heading', { name: 'Menu header' }).className, 'menu-header');
    assert.equal(screen.getByText('Menu item text').className, 'menu-text');
    assert.equal(screen.getByText('Publish now').className, 'menu-item-content');
    assert.equal(
        screen.getByText('Make this page visible immediately').className,
        'menu-item-description'
    );
    assert.equal(screen.getByRole('separator').className, 'menu-divider');
});

it('opens nested submenus with click, hover, and keyboard input', async () => {
    render(
        <Menu label="Actions">
            <MenuSubmenu label="File">
                <MenuItem href="/new">New</MenuItem>
            </MenuSubmenu>
        </Menu>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    const trigger = screen.getByRole('button', { name: 'File' });
    const submenu = trigger.closest('.submenu')!;

    assert.equal(trigger.getAttribute('aria-haspopup'), 'true');
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');

    fireEvent.mouseEnter(submenu);
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');

    fireEvent.mouseLeave(submenu);
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');

    await act(() => fireEvent.keyDown(trigger, { key: 'ArrowRight' }));
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');
    assert.equal(document.activeElement, screen.getByRole('link', { name: 'New' }));

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');

    fireEvent.click(trigger);
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');

    fireEvent.click(trigger);
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
});
