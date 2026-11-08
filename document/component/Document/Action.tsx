import { AnchorHTMLAttributes, FC } from 'react';

import { Button } from '../../../source/Base/Button';
import { Icon, IconProps } from '../../../source/Extension/Icon';

export interface DocumentActionProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    label: string;
    icon?: IconProps['name'];
}

export const DocumentAction: FC<DocumentActionProps> = ({
    label,
    icon,
    className = '',
    ...props
}) => (
    <Button
        variant="solid"
        theme="accent"
        size="lg"
        className={`d-inline-flex justify-content-center align-items-center gap-3 rounded-8 fw-semibold ${className}`}
        styled
        {...props}
    >
        {icon && <Icon name={icon} aria-hidden="true" />}
        {label}
    </Button>
);
