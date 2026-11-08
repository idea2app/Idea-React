import { HTMLAttributes } from 'react';

import { polymorphic } from '../Base/Polymorphic';
import { Spinner, SpinnerProps } from '../Base/Spinner';

export interface TableSpinnerProps
    extends
        HTMLAttributes<HTMLTableRowElement>,
        Pick<SpinnerProps, 'animation' | 'theme' | 'size'> {
    colSpan: number;
}

export const TableSpinner = polymorphic<TableSpinnerProps>(
    ({ as: Root = 'tr', animation = 'border', theme = 'primary', size, colSpan, ...props }) => (
        <Root {...props}>
            <td className="text-center p-4" colSpan={colSpan}>
                <Spinner {...{ animation, theme, size }} role="status" aria-label="Loading" />
            </td>
        </Root>
    )
);
TableSpinner.displayName = 'TableSpinner';
