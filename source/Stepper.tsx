import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import { ComponentTheme } from './Button';
import { Breakpoint } from './Grid';

export interface StepperProps extends ComponentPropsWithRef<'ol'> {
    horizontal?: boolean | Breakpoint;
}

const stepperClasses = (horizontal: StepperProps['horizontal'], className?: string) =>
    classNames(
        'stepper',
        horizontal === true
            ? 'stepper-horizontal'
            : horizontal && `${horizontal}:stepper-horizontal`,
        className
    );

export const Stepper: FC<StepperProps> = ({ horizontal, className, ...props }) => (
    <ol {...props} className={stepperClasses(horizontal, className)} />
);

export interface StepperNavProps extends ComponentPropsWithRef<'nav'> {
    horizontal?: StepperProps['horizontal'];
}

export const StepperNav: FC<StepperNavProps> = ({ horizontal, className, ...props }) => (
    <nav {...props} className={stepperClasses(horizontal, className)} />
);

interface StepStyle {
    active?: boolean;
    theme?: ComponentTheme;
}

export interface StepperItemProps extends ComponentPropsWithRef<'li'>, StepStyle {}

export const StepperItem: FC<StepperItemProps> = ({ active, theme, className, ...props }) => (
    <li
        {...props}
        className={classNames('stepper-item', { active }, theme && `theme-${theme}`, className)}
    />
);

export interface StepperLinkProps extends ComponentPropsWithRef<'a'>, StepStyle {}

export const StepperLink: FC<StepperLinkProps> = ({ active, theme, className, ...props }) => (
    <a
        {...props}
        className={classNames('stepper-item', { active }, theme && `theme-${theme}`, className)}
    />
);

export interface StepperButtonProps extends ComponentPropsWithRef<'button'>, StepStyle {}

export const StepperButton: FC<StepperButtonProps> = ({
    active,
    theme,
    className,
    type = 'button',
    ...props
}) => (
    <button
        {...props}
        type={type}
        className={classNames('stepper-item', { active }, theme && `theme-${theme}`, className)}
    />
);

export const StepperOverflow: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('stepper-overflow', className)} />
);

Stepper.displayName = 'Stepper';
StepperNav.displayName = 'StepperNav';
StepperItem.displayName = 'StepperItem';
StepperLink.displayName = 'StepperLink';
StepperButton.displayName = 'StepperButton';
StepperOverflow.displayName = 'StepperOverflow';
