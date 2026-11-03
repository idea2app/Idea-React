import classNames from 'classnames';
import { ComponentPropsWithRef, CSSProperties, PropsWithChildren } from 'react';

import type { ComponentTheme } from '../Button';
import { polymorphic } from '../Polymorphic';
import { FormValidationProps } from './Primitives';

export type FormSwitchProps = Omit<ComponentPropsWithRef<'label'>, 'children'> &
    PropsWithChildren<
        FormValidationProps & {
            inputProps?: Omit<ComponentPropsWithRef<'input'>, 'type'>;
            size?: 'sm' | 'lg';
            theme?: ComponentTheme;
            width?: string;
            indicatorWidth?: string;
        }
    >;

export const FormSwitch = polymorphic<FormSwitchProps>(
    ({
        as: Root = 'label',
        className,
        inputProps,
        size,
        theme,
        validation,
        width,
        indicatorWidth,
        style,
        children,
        ...props
    }) => (
        <Root
            {...props}
            className={classNames(
                'switch',
                size && `switch-${size}`,
                theme && `theme-${theme}`,
                validation && `is-${validation}`,
                className
            )}
            style={
                {
                    '--bs-switch-width': width,
                    '--bs-switch-indicator-width': indicatorWidth,
                    ...style
                } as CSSProperties
            }
        >
            <input
                role="switch"
                {...inputProps}
                type="checkbox"
                aria-invalid={validation ? validation === 'invalid' : inputProps?.['aria-invalid']}
                className={classNames(validation && `is-${validation}`, inputProps?.className)}
            />
            {children}
        </Root>
    )
);

FormSwitch.displayName = 'FormSwitch';
