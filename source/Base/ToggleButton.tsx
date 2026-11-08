import classNames from 'classnames';
import { ComponentPropsWithRef, CSSProperties, Ref } from 'react';

import { splitInputProps } from '../Form/inputProps';
import { polymorphic } from '../Helper/Polymorphic';
import type { ComponentTheme } from './Button';

type NativeInputProps = Omit<ComponentPropsWithRef<'input'>, 'ref' | 'type' | 'size'>;

export type ToggleButtonProps = Omit<
    ComponentPropsWithRef<'label'>,
    keyof NativeInputProps | 'onChange'
> &
    NativeInputProps & {
        type?: 'checkbox' | 'radio';
        variant?: 'solid' | 'outline' | 'subtle' | 'text';
        theme?: ComponentTheme;
        size?: 'xs' | 'sm' | 'lg';
        inputRef?: Ref<HTMLInputElement>;
        inputClassName?: string;
        inputStyle?: CSSProperties;
    };

export const ToggleButton = polymorphic<ToggleButtonProps>(
    ({
        as: Root = 'label',
        type = 'checkbox',
        variant = 'solid',
        className,
        theme,
        name,
        value,
        checked,
        defaultChecked,
        disabled,
        required,
        size,
        inputRef,
        inputClassName,
        inputStyle,
        children,
        onChange,
        ...props
    }) => {
        const { inputProps, rootProps } = splitInputProps(props);

        return (
            <Root
                {...rootProps}
                className={classNames(
                    'btn-check',
                    `btn-${variant}`,
                    theme && `theme-${theme}`,
                    size && `btn-${size}`,
                    className
                )}
            >
                <input
                    {...inputProps}
                    ref={inputRef}
                    className={inputClassName}
                    style={inputStyle}
                    {...{ type, name, value, checked, defaultChecked, disabled, required }}
                    autoComplete={inputProps.autoComplete ?? 'off'}
                    onChange={onChange}
                />
                {children}
            </Root>
        );
    }
);
ToggleButton.displayName = 'ToggleButton';
