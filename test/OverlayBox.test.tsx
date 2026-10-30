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
        'tooltip show bs-tooltip-end position-absolute top-50 start-100 translate-middle-y'
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
