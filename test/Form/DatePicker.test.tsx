import assert from 'node:assert/strict';
import { before, it, mock } from 'node:test';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';

import { DatePicker, DatePickerButton, DatePickerInline } from '../../source/Form';

before(() =>
    Object.assign(globalThis, {
        NodeFilter: window.NodeFilter,
        requestAnimationFrame: window.requestAnimationFrame.bind(window),
        cancelAnimationFrame: window.cancelAnimationFrame.bind(window)
    })
);

it('renders a native date control by default', () => {
    const ref = createRef<HTMLInputElement>();
    render(<DatePicker ref={ref} aria-label="Start date" min="2026-01-01" />);

    assert.equal(screen.getByLabelText('Start date').getAttribute('type'), 'date');
    assert.equal(screen.getByLabelText('Start date').getAttribute('min'), '2026-01-01');
    assert.equal(ref.current, screen.getByLabelText('Start date'));
});

it('supports button and inline calendars with multi-month range and formatting options', async () => {
    const changed = mock.fn();
    const { default: Plugin } = await import('bootstrap/js/src/datepicker.js');
    const options = { locale: 'en-US', dateFormat: { year: 'numeric' as const } };
    const ref = createRef<HTMLDivElement>();
    const { unmount } = render(
        <div>
            <DatePickerButton
                leadingIcon="calendar-week"
                selectionMode="multiple-ranged"
                displayMonthsCount={2}
                firstWeekday={0}
                placement="center"
                datepickerTheme="dark"
                selectedDates={['2026-06-25', '2026-07-08']}
                options={options}
                onDatesChange={changed}
            >
                Dates
            </DatePickerButton>
            <DatePickerInline ref={ref} aria-label="Inline calendar" />
        </div>
    );
    const button = screen.getByRole('button', { name: 'Dates' });
    const inline = screen.getByLabelText('Inline calendar');

    await waitFor(() => assert.ok(Plugin.getInstance(button)));
    await waitFor(() => assert.ok(Plugin.getInstance(inline)));

    assert.equal(button.getAttribute('data-bs-display-months-count'), '2');
    assert.equal(button.getAttribute('data-bs-first-weekday'), '0');
    assert.equal(button.getAttribute('data-bs-datepicker-theme'), 'dark');
    assert.ok(button.querySelector('.bi-calendar-week'));
    assert.equal(ref.current, inline);
    assert.equal(inline.getAttribute('data-bs-inline'), 'true');
    fireEvent.click(button);

    await waitFor(() =>
        assert.deepEqual(Plugin.getInstance(button)?.getSelectedDates(), [
            '2026-06-25',
            '2026-07-08'
        ])
    );

    button.dispatchEvent(
        Object.assign(new Event('change.bs.datepicker'), { dates: ['2026-07-09'] })
    );

    assert.deepEqual(changed.mock.calls[0].arguments[0], ['2026-07-09']);

    unmount();
    await new Promise(resolve => setTimeout(resolve, 0));

    assert.equal(Plugin.getInstance(button), null);
    assert.equal(Plugin.getInstance(inline), null);
});

it('reconfigures enhanced inputs when options change and releases enhanced mode', async () => {
    const { default: Plugin } = await import('bootstrap/js/src/datepicker.js');
    const { rerender } = render(<DatePicker aria-label="Date" min="2026-01-01" enhanced />);
    const input = screen.getByLabelText('Date');

    await waitFor(() => assert.ok(Plugin.getInstance(input)));
    const original = Plugin.getInstance(input);

    rerender(<DatePicker aria-label="Date" min="2026-02-01" displayMonthsCount={2} enhanced />);

    await waitFor(() =>
        assert.ok(Plugin.getInstance(input) && Plugin.getInstance(input) !== original)
    );

    rerender(<DatePicker aria-label="Date" />);

    await waitFor(() => assert.equal(Plugin.getInstance(input), null));
    assert.equal(input.getAttribute('type'), 'date');
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
