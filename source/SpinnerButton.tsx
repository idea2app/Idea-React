import { FC } from 'react';

import { Button, ButtonProps } from './Button';
import { Spinner, SpinnerAnimation } from './Spinner';

export type SpinnerButtonProps = ButtonProps & {
    animation?: SpinnerAnimation;
    loading?: boolean;
};

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
                    className={children ? 'me-2' : ''}
                    size="sm"
                    animation={animation}
                    role="status"
                    aria-hidden="true"
                />
                {!children && <span className="visually-hidden">Loading...</span>}
            </>
        )}
        {children}
    </Button>
);

SpinnerButton.displayName = 'SpinnerButton';
