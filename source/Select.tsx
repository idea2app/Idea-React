'use client';

import classNames from 'classnames';
import {
    ButtonHTMLAttributes,
    Children,
    FC,
    isValidElement,
    MouseEvent,
    ReactElement,
    ReactNode
} from 'react';

import { ButtonProps } from './Button';
import { Menu } from './Menu';

export interface OptionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    value?: string;
}

export const Option: FC<OptionProps> = ({ value, className, children, ...props }) => (
    <button
        {...props}
        type="button"
        className={classNames('menu-item', className)}
        data-value={value}
    >
        {children}
    </button>
);

Option.displayName = 'Option';

export type SelectProps = Pick<
    ButtonProps,
    'className' | 'style' | 'size' | 'theme' | 'variant' | 'disabled' | 'children'
> & {
    align?: 'start' | 'end';
    menuClassName?: string;
    value?: string;
    onChange?: (value: string) => void;
    valueRender?: (value: string) => ReactNode;
};

export const Select: FC<SelectProps> = ({
    align,
    className,
    menuClassName,
    children,
    theme = 'primary',
    variant = 'solid',
    size,
    disabled,
    style,
    value,
    onChange,
    valueRender
}) => {
    const current = Children.toArray(children).find(
        node =>
            isValidElement<OptionProps>(node) && node.type === Option && node.props.value === value
    ) as ReactElement<OptionProps> | undefined;

    const handleSelect = ({ target }: MouseEvent<HTMLDivElement>) => {
        if (!(target instanceof Element)) return;

        const option = target.closest<HTMLButtonElement>('[data-value]');
        if (option) onChange?.(option.dataset.value || '');
    };

    return (
        <Menu
            align={align}
            className="w-100"
            menuClassName={menuClassName}
            label={valueRender?.(value ?? '') ?? current?.props.children}
            toggleProps={{
                className: classNames(
                    'w-100 d-flex justify-content-between align-items-center',
                    className
                ),
                theme,
                variant,
                size,
                disabled,
                style
            }}
            onClick={handleSelect}
        >
            {children}
        </Menu>
    );
};

Select.displayName = 'Select';
