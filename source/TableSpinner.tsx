import { FC, HTMLAttributes } from 'react';

import { Spinner, SpinnerProps } from './Spinner';

export interface TableSpinnerProps
    extends
        HTMLAttributes<HTMLTableRowElement>,
        Pick<SpinnerProps, 'animation' | 'theme' | 'size'> {
    colSpan: number;
}

export const TableSpinner: FC<TableSpinnerProps> = ({
    animation = 'border',
    theme = 'primary',
    size,
    colSpan,
    ...props
}) => (
    <tr {...props}>
        <td className="text-center p-4" colSpan={colSpan}>
            <Spinner {...{ animation, theme, size }} role="status" aria-label="Loading" />
        </td>
    </tr>
);

TableSpinner.displayName = 'TableSpinner';
