import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { OverlayBox } from '../source/OverlayBox';

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
        'tooltip show bs-tooltip-end position-absolute w-max top-50 start-100 translate-middle-y'
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
