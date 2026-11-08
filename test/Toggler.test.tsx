import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Toggler } from '../source/Base/Toggler';

it('toggles own classes, including removal of existing multiple classes', () => {
    render(
        <Toggler className="fg-danger" value="fg-danger bg-2">
            Toggle
        </Toggler>
    );
    const button = screen.getByRole('button');

    fireEvent.click(button);

    assert.equal(button.classList.contains('fg-danger'), false);
    assert.equal(button.classList.contains('bg-2'), true);

    fireEvent.click(button);

    assert.equal(button.classList.contains('fg-danger'), true);
    assert.equal(button.classList.contains('bg-2'), false);
});

it('supports multiple targets with individual class or attribute configurations and events', () => {
    const onToggled = mock.fn();
    const { container } = render(
        <>
            <Toggler target=".target" onToggled={onToggled}>
                Toggle targets
            </Toggler>
            <div className="target" data-bs-value="bg-2" />
            <fieldset className="target" data-bs-attribute="disabled" data-bs-value="true">
                <input aria-label="Name" />
            </fieldset>
        </>
    );
    const fieldset = container.querySelector('fieldset')!;
    const toggled = mock.fn();
    fieldset.addEventListener('toggled.bs.toggler', toggled);

    fireEvent.click(screen.getByRole('button'));

    assert.equal(container.querySelector('div.target')?.classList.contains('bg-2'), true);
    assert.equal(fieldset.disabled, true);
    assert.equal(onToggled.mock.calls[0].arguments[0].length, 2);
    assert.equal(toggled.mock.callCount(), 1);

    fireEvent.click(screen.getByRole('button'));

    assert.equal(fieldset.disabled, false);
});

it('honors canceled clicks and canceled per-target toggle events', () => {
    const { rerender } = render(
        <Toggler value="active" onClick={event => event.preventDefault()}>
            Toggle
        </Toggler>
    );
    const button = screen.getByRole('button');

    fireEvent.click(button);

    assert.equal(button.classList.contains('active'), false);

    rerender(<Toggler value="active">Toggle</Toggler>);
    button.addEventListener('toggle.bs.toggler', event => event.preventDefault());
    fireEvent.click(button);

    assert.equal(button.classList.contains('active'), false);
});

it('supports keyboard-accessible non-button surfaces and disabled interaction', () => {
    const onClick = mock.fn();
    const { rerender } = render(
        <Toggler as="div" value="fg-danger" onClick={onClick}>
            Toggle surface
        </Toggler>
    );
    const surface = screen.getByRole('button');

    assert.equal(surface.tagName, 'DIV');
    assert.equal(surface.tabIndex, 0);

    fireEvent.keyDown(surface, { key: 'Enter' });

    assert.equal(surface.classList.contains('fg-danger'), true);

    fireEvent.keyDown(surface, { key: ' ' });

    assert.equal(surface.classList.contains('fg-danger'), false);
    assert.equal(onClick.mock.callCount(), 2);

    rerender(
        <Toggler as="div" value="fg-danger" disabled>
            Toggle surface
        </Toggler>
    );
    fireEvent.click(surface);
    fireEvent.keyDown(surface, { key: 'Enter' });

    assert.equal(surface.classList.contains('fg-danger'), false);
    assert.equal(surface.getAttribute('aria-disabled'), 'true');
    assert.equal(surface.tabIndex, -1);
});
