import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Table } from '../source/Table';

it('uses Bootstrap 6 table variants and responsive wrapper', () => {
    render(
        <Table responsive="lg" className="custom" striped hover bordered small>
            <tbody>
                <tr>
                    <td>Cell</td>
                </tr>
            </tbody>
        </Table>
    );

    const table = screen.getByRole('table');

    assert.equal(table.className, 'table table-striped table-hover table-bordered table-sm custom');
    assert.equal(table.parentElement?.className, 'table-responsive lg:table-responsive');
});
