import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';

export interface CloseButtonProps extends ComponentPropsWithRef<'button'> {
    dismiss?: string;
}

export const CloseButton = polymorphic<CloseButtonProps>(
    ({
        as: Root = 'button',
        dismiss,
        className,
        type = 'button',
        'aria-label': ariaLabel = 'Close',
        ...props
    }) => (
        <Root
            {...props}
            type={type}
            className={classNames('btn-close', className)}
            data-bs-dismiss={dismiss}
            aria-label={ariaLabel}
        />
    )
);
CloseButton.displayName = 'CloseButton';
