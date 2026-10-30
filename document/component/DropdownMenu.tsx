import { FC, PropsWithChildren, ReactNode } from 'react';

import { Icon } from '../../source/Icon';
import { Menu, MenuProps } from '../../source/Menu';

export interface DropdownMenuProps extends PropsWithChildren, Pick<MenuProps, 'toggleProps'> {
    label: ReactNode;
    className?: string;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
    label,
    className = '',
    children,
    toggleProps
}) => (
    <Menu
        className={className}
        menuClassName="mt-3"
        autoClose="outside"
        toggleProps={{
            variant: 'text',
            ...toggleProps,
            className: `d-flex justify-content-center align-items-center gap-3 h-100 ${toggleProps?.className ?? ''}`
        }}
        label={
            <>
                {label}
                <Icon name="chevron-expand" size={0.75} aria-hidden="true" />
            </>
        }
    >
        {children}
    </Menu>
);
