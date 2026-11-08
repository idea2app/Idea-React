import classNames from 'classnames';
import { ComponentPropsWithRef, CSSProperties, PropsWithChildren, Ref } from 'react';

import type { ComponentTheme } from '../Base/Button';
import { polymorphic } from '../Helper/Polymorphic';
import { splitInputProps } from './inputProps';
import { FormValidationProps } from './Primitives';

type NativeInputProps = Omit<ComponentPropsWithRef<'input'>, 'ref' | 'type' | 'size'>;

export type FormSwitchProps = Omit<
    ComponentPropsWithRef<'label'>,
    keyof NativeInputProps | 'children'
> &
    PropsWithChildren<
        NativeInputProps &
            FormValidationProps & {
                size?: 'sm' | 'lg';
                theme?: ComponentTheme;
                indicatorWidth?: string;
                inputRef?: Ref<HTMLInputElement>;
                inputId?: string;
                inputClassName?: string;
                inputStyle?: CSSProperties;
            }
    >;

export const FormSwitch = polymorphic<FormSwitchProps>(
    ({
        as: Root = 'label',
        id,
        className,
        size,
        theme,
        validation,
        width,
        indicatorWidth,
        inputRef,
        inputId,
        inputClassName,
        inputStyle,
        style,
        children,
        ...props
    }) => {
        const { inputProps, rootProps } = splitInputProps(props);
        const { 'aria-invalid': ariaInvalid } = inputProps;

        return (
            <Root
                id={id}
                {...rootProps}
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
                    {...inputProps}
                    ref={inputRef}
                    id={inputId}
                    role="switch"
                    type="checkbox"
                    className={classNames(validation && `is-${validation}`, inputClassName)}
                    style={inputStyle}
                    aria-invalid={validation ? validation === 'invalid' : ariaInvalid}
                />
                {children}
            </Root>
        );
    }
);
FormSwitch.displayName = 'FormSwitch';
