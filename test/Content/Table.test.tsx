import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Table } from '../../source/Content/Tables';

it('uses Bootstrap 6 table variants, alignment, caption, stacking, and responsive wrapper', () => {
    render(
        <Table
            responsive="lg"
            className="custom"
            striped
            hover
            bordered
            small
            stacked="md"
            verticalAlign="middle"
            captionTop
        >
            <tbody>
                <tr>
                    <td>Cell</td>
                </tr>
            </tbody>
        </Table>
    );
    const table = screen.getByRole('table');

    assert.equal(
        table.className,
        'table table-striped table-hover table-bordered table-sm md:table-stacked align-middle caption-top custom'
    );
    assert.equal(table.parentElement?.className, 'table-responsive lg:table-responsive');
});

it('wraps table-card around non-responsive tables without moving table props', () => {
    render(
        <Table card className="custom" data-testid="table">
            <tbody>
                <tr>
                    <td>Cell</td>
                </tr>
            </tbody>
        </Table>
    );
    const table = screen.getByTestId('table');

    assert.equal(table.className, 'table custom');
    assert.equal(table.parentElement?.className, 'table-card');
});

it('applies table-card to the responsive wrapper', () => {
    render(
        <Table responsive card>
            <tbody>
                <tr>
                    <td>Cell</td>
                </tr>
            </tbody>
        </Table>
    );
    const table = screen.getByRole('table');

    assert.equal(table.className, 'table');
    assert.equal(table.parentElement?.className, 'table-responsive table-card');
});
