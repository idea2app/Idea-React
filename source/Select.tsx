import { makeArray } from 'web-utility';
import classNames from 'classnames';
import React, {
    ReactNode,
    ReactElement,
    isValidElement,
    PropsWithChildren,
    FC
} from 'react';
import { Dropdown, DropdownButtonProps } from 'react-bootstrap';

export type OptionProps = PropsWithChildren<{
    value?: string;
}>;

export const Option: FC<OptionProps> = ({ value, children }) => (
    <Dropdown.Item data-value={value}>{children}</Dropdown.Item>
);

Option.displayName = 'Option';

export type SelectProps = PropsWithChildren<
    Pick<DropdownButtonProps, 'variant' | 'menuVariant'> & {
        className?: string;
        value?: string;
        onChange?: (value: string) => any;
    }
>;

export const Select: FC<SelectProps> = ({
    className,
    variant,
    menuVariant,
    children,
    value,
    onChange
}) => {
    const current = (makeArray(children) as ReactNode[]).find(
        node =>
            isValidElement<OptionProps>(node) &&
            node.type === Option &&
            node.props.value === value
    ) as ReactElement<OptionProps, typeof Option>;

    return (
        <Dropdown
            onClick={({ target }) => {
                const option = (target as HTMLElement).closest<HTMLElement>(
                    '.dropdown-item'
                );
                if (!option) return;

                const { value } = option.dataset;

                onChange?.(value);
            }}
        >
            <Dropdown.Toggle
                className={classNames(
                    'w-100',
                    'd-flex',
                    'justify-content-between',
                    'align-items-center',
                    !variant && 'bg-white text-dark',
                    className
                )}
                variant={variant}
            >
                <div>{current?.props.children}</div>
            </Dropdown.Toggle>

            <Dropdown.Menu variant={menuVariant}>{children}</Dropdown.Menu>
        </Dropdown>
    );
};

Select.displayName = 'Select';
