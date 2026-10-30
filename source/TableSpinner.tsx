import { FC, HTMLAttributes } from 'react';

import type { ComponentTheme } from './Button';
import { Spinner, SpinnerAnimation } from './Spinner';

export type TableSpinnerProps = HTMLAttributes<HTMLTableRowElement> & {
    animation?: SpinnerAnimation;
    theme?: ComponentTheme;
    size?: 'sm';
    colSpan: number;
};

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
