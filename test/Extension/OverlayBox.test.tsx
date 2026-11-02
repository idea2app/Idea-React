import assert from 'node:assert/strict';
import { it } from 'node:test';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { OverlayBox } from '../../source/Extension/OverlayBox';

const rect = (left: number, top: number, width: number, height: number) => ({
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

it('flips at viewport edges, shifts within padding, applies offsets and updates on resize', t => {
    t.mock.getter(window, 'innerWidth', () => 400);
    t.mock.getter(window, 'innerHeight', () => 300);
    t.mock.method(HTMLElement.prototype, 'getBoundingClientRect', function (this: HTMLElement) {
        return this.classList.contains('tooltip') ? rect(0, 0, 100, 40) : rect(350, 2, 40, 20);
    });
    const ref = createRef<OverlayBox>();
    render(
        <OverlayBox ref={ref} title="Geometry" trigger="click" placement="top" offset={[5, 12]}>
            <button>Open geometry</button>
        </OverlayBox>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open geometry' }));
    const overlay = screen.getByRole('tooltip');

    assert.equal(overlay.dataset.bsPlacement, 'bottom');
    assert.equal(overlay.style.left, '292px');
    assert.equal(overlay.style.top, '34px');
    assert.equal((overlay.querySelector('.tooltip-arrow') as HTMLElement).style.left, '78px');

    t.mock.method(ref.current!.root.current!, 'getBoundingClientRect', () =>
        rect(100, 100, 40, 20)
    );
    act(() => window.dispatchEvent(new Event('resize')));

    assert.equal(overlay.dataset.bsPlacement, 'top');
    assert.equal(overlay.style.left, '75px');
    assert.equal(overlay.style.top, '48px');
});

it('supports responsive placement and releases resize, scroll and size observers', t => {
    let width = 500;
    t.mock.getter(window, 'innerWidth', () => width);
    t.mock.method(HTMLElement.prototype, 'getBoundingClientRect', function (this: HTMLElement) {
        return this.classList.contains('tooltip') ? rect(0, 0, 80, 30) : rect(100, 100, 40, 20);
    });
    const add = t.mock.method(window, 'addEventListener');
    const remove = t.mock.method(window, 'removeEventListener');
    const removeScroll = t.mock.method(document, 'removeEventListener');
    const disconnect = t.mock.method(window.ResizeObserver.prototype, 'disconnect');
    const { unmount } = render(
        <OverlayBox
            title="Responsive"
            trigger="click"
            placement="top"
            responsivePlacement={{ md: 'right', lg: 'bottom' }}
        >
            <button>Responsive trigger</button>
        </OverlayBox>
    );
    fireEvent.click(screen.getByRole('button'));
    const overlay = screen.getByRole('tooltip');

    assert.equal(overlay.dataset.bsPlacement, 'top');

    width = 800;
    act(() => window.dispatchEvent(new Event('resize')));

    assert.equal(overlay.dataset.bsPlacement, 'right');

    width = 1200;
    act(() => document.dispatchEvent(new Event('scroll')));

    assert.equal(overlay.dataset.bsPlacement, 'bottom');

    unmount();

    assert.ok(add.mock.calls.some(({ arguments: [name] }) => name === 'resize'));
    assert.ok(remove.mock.calls.some(({ arguments: [name] }) => name === 'resize'));
    assert.ok(
        removeScroll.mock.calls.some(
            ({ arguments: [name, , capture] }) => name === 'scroll' && capture === true
        )
    );
    assert.equal(disconnect.mock.callCount(), 1);
});

it('portals into a custom container, translates coordinates and preserves interactive content', t => {
    const container = document.createElement('div');
    container.id = 'overlay-target';
    container.style.position = 'relative';
    container.scrollLeft = 15;
    container.scrollTop = 25;
    document.body.append(container);

    t.after(() => container.remove());
    t.mock.method(HTMLElement.prototype, 'getBoundingClientRect', function (this: HTMLElement) {
        return this === container
            ? rect(40, 20, 300, 200)
            : this.classList.contains('popover')
              ? rect(0, 0, 100, 40)
              : rect(100, 100, 40, 20);
    });
    const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent');

    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
        configurable: true,
        get(this: HTMLElement) {
            return this.classList.contains('popover') ? container : null;
        }
    });
    t.after(() => {
        if (descriptor) Object.defineProperty(HTMLElement.prototype, 'offsetParent', descriptor);
        else Reflect.deleteProperty(HTMLElement.prototype, 'offsetParent');
    });
    render(
        <OverlayBox
            title="Portal"
            detail={<button>Inside portal</button>}
            trigger={['hover', 'focus']}
            container="#overlay-target"
            placement="bottom"
            offset={10}
        >
            <button>Portal trigger</button>
        </OverlayBox>
    );
    const trigger = screen.getByRole('button', { name: 'Portal trigger' });
    fireEvent.mouseEnter(trigger);

    const overlay = screen.getByRole('tooltip');

    assert.equal(overlay.parentElement, container);
    assert.equal(overlay.style.left, '45px');
    assert.equal(overlay.style.top, '135px');

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Inside portal' }));
    fireEvent.mouseLeave(trigger, { relatedTarget: overlay });

    assert.ok(screen.getByRole('tooltip'));

    fireEvent.focus(screen.getByRole('button', { name: 'Inside portal' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Inside portal' }), { key: 'Escape' });

    assert.equal(screen.queryByRole('tooltip'), null);
});

it('preserves existing descriptions and dismisses focus-triggered portals only when focus leaves both', () => {
    render(
        <OverlayBox
            title="Focus help"
            detail={<button>Portal action</button>}
            trigger="focus"
            container={() => document.body}
        >
            <button aria-describedby="existing-description">Focus trigger</button>
        </OverlayBox>
    );
    const trigger = screen.getByRole('button', { name: 'Focus trigger' });
    fireEvent.focus(trigger);

    const overlay = screen.getByRole('tooltip');
    const action = screen.getByRole('button', { name: 'Portal action' });

    assert.equal(trigger.getAttribute('aria-describedby'), `existing-description ${overlay.id}`);

    fireEvent.blur(trigger, { relatedTarget: action });
    fireEvent.focus(action);
    fireEvent.pointerDown(action);

    assert.ok(screen.getByRole('tooltip'));

    fireEvent.blur(action, { relatedTarget: document.body });

    assert.equal(screen.queryByRole('tooltip'), null);
    assert.equal(trigger.getAttribute('aria-describedby'), 'existing-description');

    fireEvent.focus(trigger);
    fireEvent.pointerDown(document.body);

    assert.equal(screen.queryByRole('tooltip'), null);
});

it('shows and dismisses a Bootstrap 6 tooltip from its configured trigger', () => {
    render(
        <OverlayBox title="More information" trigger="click" placement="right">
            <button type="button">Details</button>
        </OverlayBox>
    );
    fireEvent.focus(screen.getByRole('button', { name: 'Details' }));

    assert.equal(screen.queryByRole('tooltip'), null);

    const trigger = screen.getByRole('button', { name: 'Details' });
    fireEvent.click(trigger);

    assert.equal(
        screen.getByRole('tooltip', { name: 'More information' }).className,
        'tooltip show bs-tooltip-end w-max'
    );
    assert.equal(
        trigger.getAttribute('aria-describedby'),
        screen.getByRole('tooltip', { name: 'More information' }).id
    );
    fireEvent.click(trigger);

    assert.equal(screen.queryByRole('tooltip'), null);

    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });

    assert.equal(screen.queryByRole('tooltip'), null);

    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);

    assert.equal(screen.queryByRole('tooltip'), null);
});

it('applies a custom overlay class for scoped tooltip and popover theming', () => {
    render(
        <>
            <OverlayBox title="Themed tooltip" trigger="click" overlayClassName="custom-tooltip">
                <button type="button">Tooltip trigger</button>
            </OverlayBox>
            <OverlayBox
                title="Themed popover"
                detail="Themed content"
                trigger="click"
                overlayClassName="custom-popover"
            >
                <button type="button">Popover trigger</button>
            </OverlayBox>
        </>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Tooltip trigger' }));
    fireEvent.click(screen.getByRole('button', { name: 'Popover trigger' }));

    assert.match(
        screen.getByRole('tooltip', { name: 'Themed tooltip' }).className,
        /custom-tooltip/
    );
    assert.match(
        screen.getByRole('tooltip', { name: /Themed popover/ }).className,
        /custom-popover/
    );
});
