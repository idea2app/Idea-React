import { FC, HTMLAttributes } from 'react';
import { Spinner, SpinnerProps } from 'react-bootstrap';

export interface TableSpinnerProps
    extends HTMLAttributes<HTMLTableRowElement>,
        Pick<SpinnerProps, 'animation' | 'variant' | 'size'> {
    colSpan: number;
}

export const TableSpinner: FC<TableSpinnerProps> = ({
    animation = 'border',
    variant = 'primary',
    size,
    colSpan,
    ...props
}) => (
    <tr {...props}>
        <td className="text-center p-4" colSpan={colSpan}>
            <Spinner {...{ animation, variant, size }} />
        </td>
    </tr>
);

TableSpinner.displayName = 'TableSpinner';
