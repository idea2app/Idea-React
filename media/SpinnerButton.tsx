import { FC } from 'react';
import { Button, ButtonProps, Spinner, SpinnerProps } from 'react-bootstrap';

export interface SpinnerButtonProps
    extends ButtonProps,
        Pick<SpinnerProps, 'animation'> {
    loading?: boolean;
}

export const SpinnerButton: FC<SpinnerButtonProps> = ({
    animation,
    loading,
    disabled,
    children,
    ...props
}) => (
    <Button {...props} disabled={loading || disabled}>
        {loading && (
            <>
                <Spinner
                    as="span"
                    className={children ? 'me-2' : ''}
                    size="sm"
                    animation={animation}
                    role="status"
                    aria-hidden="true"
                />
                {!children && (
                    <span className="visually-hidden">Loading...</span>
                )}
            </>
        )}
        {children}
    </Button>
);

SpinnerButton.displayName = 'SpinnerButton';
