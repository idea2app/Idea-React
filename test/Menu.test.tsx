import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Button } from '../source/Base/Button';
import { ButtonGroup } from '../source/Base/ButtonGroup';
import {
    Menu,
    MenuDivider,
    MenuHeader,
    MenuItem,
    MenuItemCheck,
    MenuItemContent,
    MenuItemDescription,
    MenuItemIcon,
    MenuPanel,
    MenuSubmenu,
    MenuText
} from '../source/Base/Menu';

it('keeps split triggers inside a nested button group for adjoining border radii', () => {
    render(
        <ButtonGroup aria-label="Split action">
            <Button>Action</Button>
            <Menu label="Toggle menu" split>
                <MenuItem>Item</MenuItem>
            </Menu>
        </ButtonGroup>
    );
    const trigger = screen.getByRole('button', { name: 'Toggle menu' });

    assert.ok(trigger.classList.contains('menu-toggle-split'));
    assert.ok(trigger.parentElement?.classList.contains('btn-group'));
    assert.equal(trigger.parentElement?.parentElement, screen.getByRole('group'));

    fireEvent.click(trigger);

    assert.equal(trigger.getAttribute('aria-expanded'), 'true');
});

it('lets navigation triggers inherit navigation styles instead of button styling', () => {
    render(
        <Menu label="Products" nav>
            <MenuItem href="/products">All products</MenuItem>
        </Menu>
    );
    assert.equal(screen.getByRole('button', { name: 'Products' }).className, 'nav-link');
});

it('leaves Enter and Space activation to the native button without double toggling', () => {
    const onOpenChange = mock.fn();
    render(
        <Menu
            label="Keyboard activation"
            toggleProps={{ variant: 'link' }}
            onOpenChange={onOpenChange}
        >
            <MenuItem>Item</MenuItem>
        </Menu>
    );
    const trigger = screen.getByRole('button', { name: 'Keyboard activation' });

    assert.equal(fireEvent.keyDown(trigger, { key: 'Enter' }), true);
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');

    fireEvent.click(trigger, { detail: 0 });
    fireEvent.keyUp(trigger, { key: 'Enter' });

    assert.equal(trigger.getAttribute('aria-expanded'), 'true');

    fireEvent.keyDown(trigger, { key: ' ' });
    fireEvent.keyUp(trigger, { key: ' ' });
    fireEvent.click(trigger, { detail: 0 });

    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    assert.deepEqual(
        onOpenChange.mock.calls.map(({ arguments: [open] }) => open),
        [true, false]
    );
});

it('flips and shifts menus at viewport edges and releases geometry observers', t => {
    const makeRect = (left: number, top: number, width: number, height: number) => ({
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
        toJSON: () => ({})
    });

    it('flips nested submenus away from the right viewport edge', t => {
        const makeRect = (left: number, top: number, width: number, height: number) => ({
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height,
            x: left,
            y: top,
            toJSON: () => ({})
        });
        t.mock.getter(window, 'innerWidth', () => 400);
        t.mock.method(HTMLElement.prototype, 'getBoundingClientRect', function (this: HTMLElement) {
            return this.classList.contains('menu')
                ? makeRect(0, 0, 100, 80)
                : makeRect(350, 100, 30, 20);
        });
        const { container } = render(
            <Menu label="Parent">
                <MenuSubmenu label="Nested">
                    <MenuItem>Nested action</MenuItem>
                </MenuSubmenu>
            </Menu>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Parent' }));
        fireEvent.click(screen.getByRole('button', { name: 'Nested' }));

        const submenu = container.querySelector<HTMLElement>('.submenu > .menu')!;

        assert.equal(submenu.dataset.bsPlacement, 'left-start');
        assert.equal(submenu.style.left, '248px');
    });
    t.mock.getter(window, 'innerWidth', () => 400);
    t.mock.getter(window, 'innerHeight', () => 300);
    t.mock.method(HTMLElement.prototype, 'getBoundingClientRect', function (this: HTMLElement) {
        return this.classList.contains('menu')
            ? makeRect(0, 0, 120, 80)
            : makeRect(370, 270, 20, 20);
    });
    const disconnect = t.mock.method(window.ResizeObserver.prototype, 'disconnect');
    const remove = t.mock.method(window, 'removeEventListener');
    const { container, unmount } = render(
        <Menu label="Collision" placement="bottom-start" offset={[5, 10]}>
            <MenuItem>Item</MenuItem>
        </Menu>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Collision' }));

    const panel = container.querySelector<HTMLElement>('.menu')!;

    assert.equal(panel.dataset.bsPlacement, 'top-start');
    assert.equal(panel.style.left, '272px');
    assert.equal(panel.style.top, '180px');

    unmount();

    assert.equal(disconnect.mock.callCount(), 1);
    assert.ok(remove.mock.calls.some(({ arguments: [name] }) => name === 'resize'));
});

it('supports placement, responsive placement, split toggles and translucent scrolling panels', t => {
    let matches = false;
    let listener: (() => unknown) | undefined;

    const remove = mock.fn();
    t.mock.method(window, 'matchMedia', () => ({
        get matches() {
            return matches;
        },
        addEventListener: (_type: string, callback: () => unknown) => (listener = callback),
        removeEventListener: remove
    }));
    const { container, unmount } = render(
        <Menu
            label="Options"
            placement="top-start"
            flip={false}
            responsivePlacement={{ lg: 'right-end' }}
            theme="dark"
            split
            translucent
            scrollable
        >
            <MenuItem active selected>
                <MenuItemIcon name="copy" />
                Copy
                <MenuItemCheck />
            </MenuItem>
        </Menu>
    );
    const toggle = screen.getByRole('button', { name: 'Options' });

    assert.ok(toggle.classList.contains('menu-toggle-split'));
    assert.equal(container.firstElementChild?.getAttribute('data-bs-theme'), 'dark');

    fireEvent.click(toggle);

    const item = screen.getByRole('button', { name: 'Copy' });
    const panel = container.querySelector('.menu')!;

    assert.ok(item.classList.contains('active'));
    assert.equal(item.getAttribute('aria-pressed'), 'true');
    assert.ok(panel.classList.contains('bottom-100'));
    assert.ok(panel.classList.contains('menu-translucent'));
    assert.ok(panel.classList.contains('menu-scrollable'));
    assert.ok(item.querySelector('.menu-item-icon'));
    assert.ok(item.querySelector('.menu-item-check'));

    matches = true;
    act(() => listener?.());

    assert.ok(panel.classList.contains('start-100'));
    assert.ok(!panel.classList.contains('bottom-100'));
    assert.equal(panel.getAttribute('data-bs-placement'), 'right-end');

    unmount();

    assert.equal(remove.mock.callCount(), 1);
});

it('does not intercept editing keys inside custom forms', () => {
    render(
        <Menu label="Options">
            <input aria-label="Search" />
        </Menu>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Options' }));

    const input = screen.getByRole('textbox', { name: 'Search' });
    input.focus();

    fireEvent.keyDown(input, { key: 'Home' });

    assert.equal(document.activeElement, input);
});

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
