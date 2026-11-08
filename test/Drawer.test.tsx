import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Drawer, DrawerHeader, DrawerTitle } from '../source/Base/Drawer';

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
    assert.equal(screen.getByRole('heading', { name: 'Menu' }).className, 'drawer-title');
    assert.equal(screen.getByText('Drawer content').parentElement?.className, 'drawer-body mb-2');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    assert.equal(onDismiss.mock.callCount(), 1);
    assert.equal((drawer as HTMLDialogElement).open, false);
});

it('supports sheet, translucent, instant and fullscreen drawer shapes', () => {
    render(<Drawer title="Sheet" animation="instant" sheet translucent fullscreen open />);

    const drawer = screen.getByRole('dialog', { name: 'Sheet' });

    assert.equal(
        drawer.className,
        'drawer drawer-end drawer-sheet drawer-translucent drawer-instant drawer-fullscreen'
    );
});

it('switches responsive drawers between inline content and a closed mobile panel', t => {
    let matches = true;
    let listener: (() => unknown) | undefined;

    const remove = mock.fn();
    t.mock.method(window, 'matchMedia', () => ({
        get matches() {
            return matches;
        },
        addEventListener: (_type: string, callback: () => unknown) => {
            listener = callback;
        },
        removeEventListener: remove
    }));
    const { container, unmount } = render(<Drawer title="Responsive" responsive="lg" />);
    const drawer = container.querySelector('dialog')!;

    assert.equal(drawer.className, 'lg:drawer drawer-end');
    assert.equal(drawer.open, true);

    matches = false;
    act(() => listener?.());

    assert.equal(drawer.open, false);

    unmount();

    assert.equal(remove.mock.callCount(), 1);
});

it('renders exported drawer header and title parts', () => {
    render(
        <DrawerHeader className="custom">
            <DrawerTitle>Title</DrawerTitle>
        </DrawerHeader>
    );
    assert.equal(screen.getByRole('heading', { name: 'Title' }).className, 'drawer-title');
    assert.equal(screen.getByText('Title').parentElement?.className, 'drawer-header custom');
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

it('supports scrolling with or without a modal backdrop', t => {
    const show = t.mock.method(HTMLDialogElement.prototype, 'show');
    const showModal = t.mock.method(HTMLDialogElement.prototype, 'showModal');
    const first = render(<Drawer title="Scrollable modal" scroll open />);

    assert.equal(showModal.mock.callCount(), 1);
    assert.equal(document.body.style.overflow, '');

    first.unmount();
    render(<Drawer title="Scrollable non-modal" backdrop={false} scroll open />);

    assert.equal(show.mock.callCount(), 1);
});
