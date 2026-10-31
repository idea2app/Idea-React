import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export interface CloseButtonProps extends ComponentPropsWithRef<'button'> {
    dismiss?: string;
}

export const CloseButton: FC<CloseButtonProps> = ({
    dismiss,
    className,
    type = 'button',
    'aria-label': ariaLabel = 'Close',
    ...props
}) => (
    <button
        {...props}
        type={type}
        className={classNames('btn-close', className)}
        data-bs-dismiss={dismiss}
        aria-label={ariaLabel}
    />
);

CloseButton.displayName = 'CloseButton';
