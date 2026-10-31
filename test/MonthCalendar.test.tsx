import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { DateData, MonthCalendar } from '../source/MonthCalendar';

it('selects the exact item when several events share a calendar date', () => {
    const date = new Date();
    const selected: DateData[] = [];
    const items = [
        { date, content: 'First event' },
        { date, content: 'Second event' }
    ];

    render(<MonthCalendar value={items} onSelect={item => selected.push(item)} />);

    fireEvent.click(screen.getByText('Second event'));

    assert.deepEqual(selected, [items[1]]);
});
