import React, { FC, PropsWithoutRef } from 'react';
import { Spinner } from 'react-bootstrap';

export type TableSpinnerProps = PropsWithoutRef<{ colSpan: number }>;

export const TableSpinner: FC<TableSpinnerProps> = ({ colSpan }) => (
    <tr>
        <td className="text-center p-4" colSpan={colSpan}>
            <Spinner animation="border" variant="primary" />
        </td>
    </tr>
);

TableSpinner.displayName = 'TableSpinner';
