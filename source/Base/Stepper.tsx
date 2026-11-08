import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';
import { Breakpoint } from '../Layout/Grid';
import { ComponentTheme } from './Button';

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
Stepper.displayName = 'Stepper';

export interface StepperNavProps extends ComponentPropsWithRef<'nav'> {
    horizontal?: StepperProps['horizontal'];
}

export const StepperNav = polymorphic<StepperNavProps>(
    ({ as: Root = 'nav', horizontal, className, ...props }) => (
        <Root {...props} className={stepperClasses(horizontal, className)} />
    )
);
StepperNav.displayName = 'StepperNav';

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
StepperItem.displayName = 'StepperItem';

export type StepperLinkProps = ComponentPropsWithRef<'a'> & StepStyle;

export const StepperLink = polymorphic<StepperLinkProps>(
    ({ as: Root = 'a', active, theme, className, ...props }) => (
        <Root
            {...props}
            className={classNames('stepper-item', { active }, theme && `theme-${theme}`, className)}
        />
    )
);
StepperLink.displayName = 'StepperLink';

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
StepperButton.displayName = 'StepperButton';

export const StepperOverflow = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('stepper-overflow', className)} />
    )
);
StepperOverflow.displayName = 'StepperOverflow';
