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

    fireEvent.click(screen.getByRole('button', { name: 'Details' }));

    assert.equal(
        screen.getByRole('tooltip', { name: 'More information' }).className,
        'tooltip show bs-tooltip-end position-absolute top-50 start-100 translate-middle-y'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Details' }));

    assert.equal(screen.queryByRole('tooltip'), null);
});
