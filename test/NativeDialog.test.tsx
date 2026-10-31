import assert from 'node:assert/strict';
import { it } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { NativeDialog } from '../source/NativeDialog';

it('opens a native modal, closes with Escape and returns focus to its trigger', () => {
    const ref = createRef<NativeDialog>();
    render(
        <>
            <button>Open</button>
            <NativeDialog ref={ref} aria-label="Example">
                Content
            </NativeDialog>
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

it('honors static backdrops and keyboard=false without closing', () => {
    const ref = createRef<NativeDialog>();
    const { rerender } = render(
        <NativeDialog ref={ref} keyboard={false} backdrop="static" aria-label="Example" />
    );
    act(() => ref.current?.show());
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    fireEvent.click(screen.getByRole('dialog'), { clientX: -1, clientY: -1 });
    assert.equal(ref.current?.open, true);

    rerender(<NativeDialog ref={ref} aria-label="Example" />);
    fireEvent.click(screen.getByRole('dialog'), { clientX: -1, clientY: -1 });
    assert.equal(ref.current?.open, false);
});

it('supports non-modal display and idempotent show/close calls', () => {
    const ref = createRef<NativeDialog>();
    render(<NativeDialog ref={ref} modal={false} />);
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
    const { container, rerender } = render(<NativeDialog aria-label="Controlled dialog" open />);
    const dialog = container.querySelector('dialog')!;

    assert.equal(dialog.open, true);

    rerender(<NativeDialog aria-label="Controlled dialog" />);

    assert.equal(dialog.open, false);
});

it('applies a Bootstrap color mode to the dialog', () => {
    const { container } = render(<NativeDialog theme="dark" />);

    assert.equal(container.querySelector('dialog')?.dataset.bsTheme, 'dark');
});
