import { makeArray } from 'web-utility';
import classNames from 'classnames';
import React, {
    CSSProperties,
    PropsWithChildren,
    ReactNode,
    ReactElement,
    FC,
    isValidElement
} from 'react';
import { Dropdown, DropdownButtonProps } from 'react-bootstrap';

export type OptionProps = PropsWithChildren<{
    className?: string;
    style?: CSSProperties;
    value?: string;
}>;

export const Option: FC<OptionProps> = ({ value, children, ...props }) => (
    <Dropdown.Item {...props} data-value={value}>
        {children}
    </Dropdown.Item>
);

Option.displayName = 'Option';

export interface SelectProps
    extends OptionProps,
        Pick<DropdownButtonProps, 'variant' | 'menuVariant'> {
    onChange?: (value: string) => any;
    valueRender?: (value: string) => ReactNode;
}

export const Select: FC<SelectProps> = ({
    className,
    style,
    variant,
    menuVariant,
    children,
    value,
    onChange,
    valueRender
}) => {
    const current = (makeArray(children) as ReactNode[])
        .flat(Infinity)
        .find(
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
                {...{ style, variant }}
            >
                {valueRender?.(value) || (
                    <div className={current?.props.className}>
                        {current?.props.children}
                    </div>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu variant={menuVariant}>{children}</Dropdown.Menu>
        </Dropdown>
    );
};

Select.displayName = 'Select';
