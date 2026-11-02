import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Popover } from '../source/Popover';

it('renders official Bootstrap 6 popover markup', () => {
    render(
        <Popover title="Details" placement="right" className="custom">
            More information
        </Popover>
    );
    const popover = screen.getByRole('tooltip');

    assert.equal(popover.className, 'popover show bs-popover-end custom');
    assert.equal(popover.getAttribute('data-bs-placement'), 'right');
    assert.equal(
        popover.querySelector('.popover-arrow')?.className,
        'popover-arrow position-absolute top-50 translate-middle-y'
    );
    assert.equal(screen.getByText('Details').className, 'popover-header');
    assert.equal(screen.getByText('More information').className, 'popover-body');
});

it('omits empty headers and hides an inactive popover from assistive technology', () => {
    const { container } = render(<Popover show={false}>Body only</Popover>);

    assert.equal(container.querySelector('.popover-header'), null);
    assert.equal(screen.queryByRole('tooltip'), null);
    assert.equal(container.querySelector('.popover')?.hasAttribute('hidden'), true);
});
