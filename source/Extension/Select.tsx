'use client';

import classNames from 'classnames';
import {
    ButtonHTMLAttributes,
    Children,
    cloneElement,
    Component,
    FC,
    isValidElement,
    MouseEvent,
    ReactElement,
    ReactNode
} from 'react';

import { ButtonProps } from '../Button';
import { Menu } from '../Menu';

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
    name?: string;
    placeholder?: ReactNode;
    'aria-label'?: string;
    onChange?: (value: string) => unknown;
    valueRender?: (value: string) => ReactNode;
};

export class Select extends Component<SelectProps> {
    static displayName = 'Select';

    private handleSelect = ({ target, defaultPrevented }: MouseEvent<HTMLDivElement>) => {
        if (defaultPrevented || this.props.disabled || !(target instanceof Element)) return;

        const option = target.closest<HTMLButtonElement>('[data-value]');

        if (option && !option.disabled && option.getAttribute('aria-disabled') !== 'true')
            this.props.onChange?.(option.dataset.value ?? '');
    };

    private renderOption = (child: ReactNode) =>
        isValidElement<OptionProps>(child) && child.type === Option
            ? cloneElement(child, {
                  className: classNames(
                      child.props.className,
                      child.props.value === this.props.value && 'selected'
                  ),
                  'aria-selected': child.props.value === this.props.value
              })
            : child;

    render() {
        const {
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
            onChange: _onChange,
            valueRender,
            name,
            placeholder,
            'aria-label': label
        } = this.props;
        const current = Children.toArray(children).find(
            node =>
                isValidElement<OptionProps>(node) &&
                node.type === Option &&
                node.props.value === value
        ) as ReactElement<OptionProps> | undefined;

        return (
            <>
                <Menu
                    align={align}
                    className="w-100"
                    menuClassName={menuClassName}
                    label={valueRender?.(value ?? '') ?? current?.props.children ?? placeholder}
                    toggleProps={{
                        className: classNames(
                            'w-100 d-flex justify-content-between align-items-center',
                            className
                        ),
                        theme,
                        variant,
                        size,
                        disabled,
                        style,
                        'aria-label': label
                    }}
                    onClick={this.handleSelect}
                >
                    {Children.map(children, this.renderOption)}
                </Menu>
                {name && (
                    <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />
                )}
            </>
        );
    }
}
