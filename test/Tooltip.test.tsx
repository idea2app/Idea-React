import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Tooltip } from '../source/Base/Tooltip';

it('renders official Bootstrap 6 tooltip markup', () => {
    render(<Tooltip placement="left">Help</Tooltip>);

    const tooltip = screen.getByRole('tooltip');

    assert.equal(tooltip.className, 'tooltip show bs-tooltip-start');
    assert.equal(tooltip.getAttribute('data-bs-placement'), 'left');
    assert.equal(
        tooltip.querySelector('.tooltip-arrow')?.className,
        'tooltip-arrow position-absolute top-50 translate-middle-y'
    );
    assert.equal(screen.getByText('Help').className, 'tooltip-inner');
});

it('removes hidden tooltip content from the accessibility tree', () => {
    const { container } = render(<Tooltip show={false}>Help</Tooltip>);

    assert.equal(screen.queryByRole('tooltip'), null);
    assert.equal(container.querySelector('.tooltip')?.hasAttribute('hidden'), true);
});
