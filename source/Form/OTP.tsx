import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export type OTPInputProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'maxLength'> & {
    length: number;
    type?: 'numeric' | 'alphanumeric' | 'alpha';
    mask?: boolean;
    groups?: number[];
    separator?: string;
    connected?: boolean;
    size?: 'sm' | 'lg';
};

export const OTPInput: FC<OTPInputProps> = ({
    className,
    length,
    type = 'numeric',
    mask,
    groups,
    separator,
    connected,
    size,
    ...props
}) => (
    <div
        className={classNames('otp', connected && 'otp-connected', size && `otp-${size}`)}
        data-bs-otp=""
        data-bs-length={length}
        data-bs-type={type}
        data-bs-mask={mask || undefined}
        data-bs-groups={groups ? JSON.stringify(groups) : undefined}
        data-bs-separator={separator}
    >
        <input
            {...props}
            type="text"
            maxLength={length}
            autoComplete={props.autoComplete || 'one-time-code'}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            pattern={
                type === 'numeric' ? '[0-9]*' : type === 'alpha' ? '[a-zA-Z]*' : '[a-zA-Z0-9]*'
            }
            className={classNames('otp-input', className)}
        />
    </div>
);

OTPInput.displayName = 'OTPInput';
