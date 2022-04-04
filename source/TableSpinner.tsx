import React, { PropsWithoutRef } from 'react';
import Spinner from 'react-bootstrap/Spinner';

export function TableSpinner({
    colSpan
}: PropsWithoutRef<{ colSpan: number }>) {
    return (
        <tr>
            <td className="text-center" colSpan={colSpan}>
                <Spinner animation="border" variant="primary" />
            </td>
        </tr>
    );
}
