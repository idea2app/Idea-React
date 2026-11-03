import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { ComponentTheme } from './Button';
import { Breakpoint } from './Grid';
import { polymorphic } from './Polymorphic';

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

export const Stepper = polymorphic<StepperProps>(
    ({ as: Root = 'ol', horizontal, className, ...props }) => (
        <Root {...props} className={stepperClasses(horizontal, className)} />
    )
);

export interface StepperNavProps extends ComponentPropsWithRef<'nav'> {
    horizontal?: StepperProps['horizontal'];
}

export const StepperNav = polymorphic<StepperNavProps>(
    ({ as: Root = 'nav', horizontal, className, ...props }) => (
        <Root {...props} className={stepperClasses(horizontal, className)} />
    )
);

interface StepStyle {
    active?: boolean;
    theme?: ComponentTheme;
}

export type StepperItemProps = ComponentPropsWithRef<'li'> & StepStyle;

export const StepperItem = polymorphic<StepperItemProps>(
    ({ as: Root = 'li', active, theme, className, ...props }) => (
        <Root
            {...props}
            className={classNames('stepper-item', { active }, theme && `theme-${theme}`, className)}
        />
    )
);

export type StepperLinkProps = ComponentPropsWithRef<'a'> & StepStyle;

export const StepperLink = polymorphic<StepperLinkProps>(
    ({ as: Root = 'a', active, theme, className, ...props }) => (
        <Root
            {...props}
            className={classNames('stepper-item', { active }, theme && `theme-${theme}`, className)}
        />
    )
);

export type StepperButtonProps = ComponentPropsWithRef<'button'> & StepStyle;

export const StepperButton = polymorphic<StepperButtonProps>(
    ({ as: Root = 'button', active, theme, className, type = 'button', ...props }) => (
        <Root
            {...props}
            type={type}
            className={classNames(
                'stepper-item p-0 border-0 bg-transparent',
                { active },
                theme && `theme-${theme}`,
                className
            )}
        />
    )
);

export const StepperOverflow = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('stepper-overflow', className)} />
    )
);

Stepper.displayName = 'Stepper';
StepperNav.displayName = 'StepperNav';
StepperItem.displayName = 'StepperItem';
StepperLink.displayName = 'StepperLink';
StepperButton.displayName = 'StepperButton';
StepperOverflow.displayName = 'StepperOverflow';
