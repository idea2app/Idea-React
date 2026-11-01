'use client';

import classNames from 'classnames';
import { Children, cloneElement, ComponentPropsWithRef, FC, isValidElement } from 'react';

import { Menu } from '../Menu';

export interface ComboboxOptionProps extends ComponentPropsWithRef<'button'> {
    value: string;
}

export const ComboboxOption: FC<ComboboxOptionProps> = ({ className, value, ...props }) => (
    <button
        {...props}
        type="button"
        className={classNames('menu-item', className)}
        data-bs-value={value}
    />
);

ComboboxOption.displayName = 'ComboboxOption';

export interface ComboboxProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
    name: string;
    value: string | string[];
    placeholder?: string;
    disabled?: boolean;
    multiple?: boolean;
    onChange?: (value: string | string[]) => unknown;
    menuClassName?: string;
}

export const Combobox: FC<ComboboxProps> = ({
    className,
    name,
    value,
    placeholder = 'Select an item…',
    disabled,
    multiple,
    onChange,
    menuClassName,
    children,
    ...props
}) => {
    const values = Array.isArray(value) ? value : value ? [value] : [];
    const options = Children.toArray(children).filter(
        (option): option is React.ReactElement<ComboboxOptionProps> =>
            isValidElement<ComboboxOptionProps>(option)
    );
    const selected = options.filter(option => values.includes(option.props.value));
    const hasSelection = selected.length > 0;
    const handleClick: ComponentPropsWithRef<'div'>['onClick'] = ({ target }) => {
        if (!(target instanceof Element)) return;

        const option = target.closest<HTMLButtonElement>('[data-bs-value]');
        if (!option || !onChange) return;

        const next = option.dataset.bsValue || '';
        onChange(
            multiple
                ? values.includes(next)
                    ? values.filter(item => item !== next)
                    : [...values, next]
                : next
        );
    };

    return (
        <div {...props} className={classNames('combobox', className)}>
            <Menu
                label={
                    <span
                        className={classNames(
                            'combobox-value',
                            !hasSelection && 'combobox-placeholder'
                        )}
                    >
                        {hasSelection ? selected.map(option => option.props.children) : placeholder}
                    </span>
                }
                toggleProps={{
                    className: 'form-control combobox-toggle',
                    variant: 'text',
                    disabled,
                    'aria-haspopup': 'listbox',
                    'aria-label': placeholder
                }}
                autoClose={!multiple}
                menuClassName={classNames(menuClassName, 'combobox-menu')}
                onClick={handleClick}
            >
                {options.map(option => {
                    const selected = values.includes(option.props.value);

                    return cloneElement(option, {
                        className: classNames(option.props.className, selected && 'selected'),
                        'aria-selected': selected
                    });
                })}
            </Menu>
            {values.map(item => (
                <input key={item} type="hidden" name={name} value={item} />
            ))}
        </div>
    );
};

Combobox.displayName = 'Combobox';
