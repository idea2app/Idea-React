import assert from 'node:assert/strict';
import { it } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import {
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '../../source/Base/Dialog';

it('supports documented animation, scrolling, size and responsive fullscreen shapes', () => {
    const { container, rerender } = render(
        <Dialog size="xl" fullscreen="lg" animation="slide-up" scrollable />
    );
    assert.equal(
        container.querySelector('dialog')?.className,
        'dialog dialog-xl lg-down:dialog-fullscreen dialog-scrollable dialog-slide-up'
    );
    rerender(<Dialog size="sm" animation="instant" fullscreen />);

    assert.equal(
        container.querySelector('dialog')?.className,
        'dialog dialog-sm dialog-fullscreen dialog-instant'
    );
});

it('opens a native modal, closes with Escape and returns focus to its trigger', () => {
    const ref = createRef<Dialog>();
    render(
        <>
            <button>Open</button>
            <Dialog ref={ref} aria-label="Example">
                Content
            </Dialog>
        </>
    );
    const trigger = screen.getByRole('button', { name: 'Open' });
    trigger.focus();
    act(() => ref.current?.show());

    assert.equal(screen.getByRole('dialog', { name: 'Example' }).className, 'dialog');
    assert.equal(ref.current?.open, true);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    assert.equal(ref.current?.open, false);
    assert.equal(document.activeElement, trigger);
});

it('preserves imperative show through unrelated content rerenders', () => {
    const ref = createRef<Dialog>();

    const { container, rerender } = render(<Dialog ref={ref}>Initial search results</Dialog>);
    act(() => ref.current?.show());
    rerender(<Dialog ref={ref}>Loading search results</Dialog>);

    assert.equal(ref.current?.open, true);
    assert.equal(container.querySelector('dialog')?.open, true);

    act(() => ref.current?.close());

    assert.equal(ref.current?.open, false);
});

it('honors static backdrops and keyboard=false without closing', () => {
    const ref = createRef<Dialog>();
    const { rerender } = render(
        <Dialog ref={ref} keyboard={false} backdrop="static" aria-label="Example" />
    );
    act(() => ref.current?.show());
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    fireEvent.click(screen.getByRole('dialog'), { clientX: -1, clientY: -1 });
    assert.equal(ref.current?.open, true);

    rerender(<Dialog ref={ref} aria-label="Example" />);
    fireEvent.click(screen.getByRole('dialog'), { clientX: -1, clientY: -1 });
    assert.equal(ref.current?.open, false);
});

it('supports non-modal display and idempotent show/close calls', () => {
    const ref = createRef<Dialog>();
    render(<Dialog ref={ref} modal={false} />);
    act(() => {
        ref.current?.show();
        ref.current?.show();
    });
    assert.equal(ref.current?.open, true);

    act(() => {
        ref.current?.close();
        ref.current?.close();
    });
    assert.equal(ref.current?.open, false);
});

it('synchronizes its native state with the open prop', () => {
    const { container, rerender } = render(<Dialog aria-label="Controlled dialog" open />);
    const dialog = container.querySelector('dialog')!;

    assert.equal(dialog.open, true);

    rerender(<Dialog aria-label="Controlled dialog" />);

    assert.equal(dialog.open, false);
});

it('applies a Bootstrap color mode to the dialog', () => {
    const { container } = render(<Dialog theme="dark" />);

    assert.equal(container.querySelector('dialog')?.dataset.bsTheme, 'dark');
});

it('renders Bootstrap 6 dialog parts', () => {
    const { container } = render(
        <Dialog aria-label="Parts">
            <DialogHeader className="custom">
                <DialogTitle>Title</DialogTitle>
            </DialogHeader>
            <DialogBody>Body</DialogBody>
            <DialogFooter>Footer</DialogFooter>
        </Dialog>
    );
    assert.equal(container.querySelector('.dialog-header')?.className, 'dialog-header custom');
    assert.equal(container.querySelector('h1')?.className, 'dialog-title');
    assert.equal(container.querySelector('.dialog-body')?.tagName, 'DIV');
    assert.equal(screen.getByText('Footer').className, 'dialog-footer');
});

it('locks body scrolling for modal dialogs and restores it after the last closes', () => {
    document.body.style.overflow = 'auto';
    const first = render(<Dialog aria-label="First" open />);
    const second = render(<Dialog aria-label="Second" open />);

    assert.equal(document.body.style.overflow, 'hidden');

    first.unmount();

    assert.equal(document.body.style.overflow, 'hidden');

    second.unmount();

    assert.equal(document.body.style.overflow, 'auto');
    document.body.style.overflow = '';
});

it('allows body scrolling explicitly and handles native command or form dismissal', () => {
    const { container, rerender } = render(<Dialog scroll open />);
    const element = container.querySelector('dialog')!;

    assert.equal(document.body.style.overflow, '');

    rerender(<Dialog open />);

    assert.equal(document.body.style.overflow, 'hidden');

    element.close();
    fireEvent(element, new Event('close'));

    assert.equal(document.body.style.overflow, '');
});

it('keeps animated dialogs open until their exit transition finishes and cancels closing on show', t => {
    t.mock.timers.enable({ apis: ['setTimeout'] });

    const ref = createRef<Dialog>();
    const { container } = render(
        <Dialog ref={ref} style={{ transitionDuration: '100ms', transitionDelay: '50ms' }} open />
    );
    const element = container.querySelector('dialog')!;

    act(() => ref.current?.close());

    assert.equal(element.open, true);
    assert.ok(element.classList.contains('hiding'));

    act(() => t.mock.timers.tick(149));

    assert.equal(element.open, true);

    act(() => ref.current?.show());
    act(() => t.mock.timers.tick(1));

    assert.equal(element.open, true);
    assert.ok(!element.classList.contains('hiding'));

    act(() => ref.current?.close());
    act(() => t.mock.timers.tick(150));

    assert.equal(element.open, false);
    assert.equal(document.body.style.overflow, '');
});
