'use client';

import classNames from 'classnames';
import { ComponentPropsWithRef, FC, ReactNode } from 'react';

export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

export const getPasswordStrength = (
    password: string,
    minLength = 8
): PasswordStrengthLevel | null => {
    const score = [
        password.length >= minLength,
        password.length >= minLength + 4,
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /\d/.test(password),
        /[^A-Za-z0-9]/.test(password),
        (password.match(/[^A-Za-z0-9]/g)?.length || 0) > 1,
        password.length >= 16
    ].filter(Boolean).length;

    return score === 0
        ? null
        : score <= 2
          ? 'weak'
          : score <= 4
            ? 'fair'
            : score <= 6
              ? 'good'
              : 'strong';
};

export interface PasswordStrengthProps extends ComponentPropsWithRef<'div'> {
    value: string;
    minLength?: number;
    messages?: Partial<Record<PasswordStrengthLevel, ReactNode>>;
    variant?: 'segments' | 'bar';
}

export const PasswordStrength: FC<PasswordStrengthProps> = ({
    className,
    value,
    minLength,
    messages,
    variant = 'segments',
    ...props
}) => {
    const strength = getPasswordStrength(value, minLength);
    const levels: PasswordStrengthLevel[] = ['weak', 'fair', 'good', 'strong'];
    const activeCount = strength ? levels.indexOf(strength) + 1 : 0;

    return variant === 'bar' ? (
        <div
            {...props}
            className={classNames('strength-bar', className)}
            data-bs-strength={strength || undefined}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={activeCount}
            aria-valuetext={strength || 'Empty'}
        />
    ) : (
        <div
            {...props}
            className={classNames('strength', className)}
            data-bs-strength={strength || undefined}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={activeCount}
            aria-valuetext={strength || 'Empty'}
        >
            {levels.map((level, index) => (
                <div
                    key={level}
                    className={classNames('strength-segment', index < activeCount && 'active')}
                />
            ))}
            {strength && <span className="strength-text">{messages?.[strength] || strength}</span>}
        </div>
    );
};

PasswordStrength.displayName = 'PasswordStrength';
