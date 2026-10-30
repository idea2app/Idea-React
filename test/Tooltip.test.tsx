import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Tooltip } from '../source/Tooltip';

it('renders official Bootstrap 6 tooltip markup', () => {
    render(<Tooltip placement="left">Help</Tooltip>);

    const tooltip = screen.getByRole('tooltip');

    assert.equal(tooltip.className, 'tooltip show bs-tooltip-start');
    assert.equal(tooltip.getAttribute('data-bs-placement'), 'left');
    assert.equal(screen.getByText('Help').className, 'tooltip-inner');
});
