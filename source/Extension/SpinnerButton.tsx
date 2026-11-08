import { Button, ButtonProps } from '../Base/Button';
import { polymorphic } from '../Base/Polymorphic';
import { Spinner, SpinnerProps } from '../Base/Spinner';

export type SpinnerButtonProps = ButtonProps &
    Pick<SpinnerProps, 'animation'> & {
        loading?: boolean;
    };

export const SpinnerButton = polymorphic<SpinnerButtonProps>(
    ({ as: RootAs, animation, loading, disabled, children, ...props }) => (
        <Button as={RootAs} {...props} disabled={loading || disabled}>
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
    )
);

SpinnerButton.displayName = 'SpinnerButton';
