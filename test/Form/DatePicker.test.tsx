import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';

import { DatePicker } from '../../source/Form';

it('renders a native date control by default', () => {
    const ref = createRef<HTMLInputElement>();
    render(<DatePicker ref={ref} aria-label="Start date" min="2026-01-01" />);

    assert.equal(screen.getByLabelText('Start date').getAttribute('type'), 'date');
    assert.equal(screen.getByLabelText('Start date').getAttribute('min'), '2026-01-01');
    assert.equal(ref.current, screen.getByLabelText('Start date'));
});

it('initializes and disposes the Bootstrap datepicker in enhanced mode', async () => {
    const { default: Datepicker } = await import('bootstrap/js/src/datepicker.js');
    const { unmount } = render(
        <div>
            <DatePicker aria-label="Appointment" selectionMode="multiple" enhanced />
        </div>
    );
    const input = screen.getByLabelText('Appointment');

    assert.equal(input.getAttribute('data-bs-toggle'), 'datepicker');
    assert.equal(input.getAttribute('data-bs-selection-mode'), 'multiple');

    await waitFor(() => assert.ok(Datepicker.getInstance(input)));

    unmount();
    await new Promise(resolve => setTimeout(resolve, 0));

    assert.equal(Boolean(Datepicker.getInstance(input)), false);
});
