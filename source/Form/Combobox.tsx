'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    ChangeEvent,
    Children,
    cloneElement,
    Component,
    ComponentPropsWithRef,
    createRef,
    FC,
    isValidElement,
    MouseEvent,
    ReactElement,
    ReactNode
} from 'react';

import { Icon } from '../Icon';
import { Menu, MenuHeader, MenuItemContent, MenuItemDescription } from '../Menu';
import { FormValidationProps } from './Primitives';

export interface ComboboxOptionProps extends ComponentPropsWithRef<'button'> {
    value: string;
    description?: ReactNode;
    icon?: string;
    checkedIcon?: boolean;
    searchText?: string;
}

export const ComboboxOption: FC<ComboboxOptionProps> = ({
    className,
    value,
    children,
    description,
    icon,
    checkedIcon,
    searchText,
    ...props
}) => (
    <button
        {...props}
        type="button"
        role="option"
        aria-selected={props['aria-selected'] ?? false}
        className={classNames('menu-item', className)}
        data-bs-value={value}
        data-search-text={searchText}
        data-label={optionText(children)}
        data-option-hidden={props.hidden || undefined}
    >
        {icon && <Icon name={icon} className="menu-item-icon" aria-hidden="true" />}
        {description ? (
            <MenuItemContent>
                {children}
                <MenuItemDescription>{description}</MenuItemDescription>
            </MenuItemContent>
        ) : (
            children
        )}
        {checkedIcon && <Icon name="check-lg" className="menu-item-check" aria-hidden="true" />}
    </button>
);

ComboboxOption.displayName = 'ComboboxOption';

export interface ComboboxGroupProps extends ComponentPropsWithRef<'div'> {
    label: ReactNode;
}

export const ComboboxGroup: FC<ComboboxGroupProps> = ({ label, children, ...props }) => (
    <div {...props} role="group" aria-label={typeof label === 'string' ? label : undefined}>
        <MenuHeader>{label}</MenuHeader>
        {children}
    </div>
);

ComboboxGroup.displayName = 'ComboboxGroup';

export interface ComboboxProps
    extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'>, FormValidationProps {
    name: string;
    value?: string | string[];
    defaultValue?: string | string[];
    placeholder?: string;
    multiple?: boolean;
    menuClassName?: string;
    disabled?: boolean;
    controlSize?: 'sm' | 'lg';
    search?: boolean;
    searchNormalize?: boolean;
    searchPlaceholder?: string;
    noResultsText?: string;
    onChange?: (value: string | string[]) => unknown;
}

const optionText = (content: ReactNode): string =>
    Children.toArray(content)
        .map(child =>
            isValidElement<{ children?: ReactNode }>(child)
                ? optionText(child.props.children)
                : String(child)
        )
        .join(' ');

const collectOptions = (children: ReactNode): ReactElement<ComboboxOptionProps>[] =>
    Children.toArray(children).flatMap(child =>
        isValidElement<ComboboxOptionProps>(child) && child.type === ComboboxOption
            ? [child]
            : isValidElement<{ children?: ReactNode }>(child)
              ? collectOptions(child.props.children)
              : []
    );

@observer
export class Combobox extends Component<ComboboxProps> {
    static displayName = 'Combobox';

    @observable accessor query = '';
    @observable accessor current = this.props.defaultValue ?? (this.props.multiple ? [] : '');
    @observable accessor visibleOptionCount = 0;
    @observable accessor selectedLabel = '';
    private menu = createRef<Menu>();
    private optionObserver?: MutationObserver;

    get values() {
        const value = this.props.value ?? this.current;

        return Array.isArray(value) ? value : value ? [value] : [];
    }

    componentDidMount() {
        this.updateAccessibility();
        this.optionObserver = new MutationObserver(this.updateAccessibility);
        const panel = this.menu.current?.panel.current;

        if (panel)
            this.optionObserver.observe(panel, {
                childList: true,
                subtree: true,
                characterData: true
            });
    }

    componentDidUpdate() {
        this.updateAccessibility();
    }

    componentWillUnmount() {
        this.optionObserver?.disconnect();
    }

    @action
    private updateAccessibility = () => {
        const panel = this.menu.current?.panel.current;
        const options = [...(panel?.querySelectorAll<HTMLButtonElement>('[data-bs-value]') ?? [])];
        const selected: string[] = [];
        let visible = 0;

        for (const option of options) {
            const value = option.dataset.bsValue ?? '';
            const text = option.dataset.searchText ?? option.textContent ?? '';
            const matches =
                option.dataset.optionHidden !== 'true' &&
                this.normalize(text).includes(this.normalize(this.query));
            const isSelected = this.values.includes(value);

            option.setAttribute('role', 'option');
            option.setAttribute('aria-selected', String(isSelected));
            option.classList.toggle('selected', isSelected);
            option.hidden = !matches;
            option.style.display = matches ? '' : 'none';
            if (matches) visible++;
            if (isSelected) selected.push(option.dataset.label ?? option.textContent ?? '');
        }
        for (const group of panel?.querySelectorAll<HTMLElement>('[role="group"]') ?? []) {
            const matches = [...group.querySelectorAll<HTMLButtonElement>('[data-bs-value]')].some(
                option => !option.hidden
            );

            group.hidden = !matches;
            group.style.display = matches ? '' : 'none';
        }
        this.visibleOptionCount = visible;
        this.selectedLabel =
            this.props.multiple && selected.length > 1
                ? `${selected.length} selected`
                : (selected[0] ?? '');

        panel?.setAttribute('role', 'listbox');
        panel?.setAttribute('aria-multiselectable', String(Boolean(this.props.multiple)));
        panel?.setAttribute(
            'aria-label',
            this.props['aria-label'] ?? this.props.placeholder ?? 'Options'
        );
        this.menu.current?.trigger.current?.setAttribute('aria-haspopup', 'listbox');
    };

    @action
    private setCurrent = (value: string | string[]) => {
        this.current = value;
    };

    @action
    private handleSearch = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
        this.query = value;
    };

    private handleClick = (event: MouseEvent<HTMLDivElement>) => {
        this.props.onClick?.(event);

        const { target, defaultPrevented } = event;
        if (defaultPrevented || this.props.disabled || !(target instanceof Element)) return;

        const option = target.closest<HTMLButtonElement>('[data-bs-value]');
        if (!option || option.disabled || option.getAttribute('aria-disabled') === 'true') return;

        const next = option.dataset.bsValue ?? '';
        const value = this.props.multiple
            ? this.values.includes(next)
                ? this.values.filter(item => item !== next)
                : [...this.values, next]
            : next;
        this.props.onChange?.(value);

        if (this.props.value === undefined) this.setCurrent(value);
    };

    private normalize = (value: string) => {
        const text = value.toLocaleLowerCase();

        return this.props.searchNormalize ? text.normalize('NFD').replace(/\p{M}/gu, '') : text;
    };

    private matches = (option: ReactElement<ComboboxOptionProps>) =>
        this.normalize(option.props.searchText ?? optionText(option.props.children)).includes(
            this.normalize(this.query)
        );

    private renderChild = (child: ReactNode): ReactNode => {
        if (!isValidElement<{ children?: ReactNode }>(child)) return child;
        if (child.type === ComboboxOption) {
            const option = child as ReactElement<ComboboxOptionProps>;
            const selected = this.values.includes(option.props.value);

            return cloneElement(option, {
                hidden: option.props.hidden || !this.matches(option),
                className: classNames(option.props.className, selected && 'selected'),
                'aria-selected': selected,
                role: 'option'
            });
        }
        const options = collectOptions(child.props.children);

        return cloneElement(child, {
            ...(child.type === ComboboxGroup && { hidden: !options.some(this.matches) }),
            children: Children.map(child.props.children, this.renderChild)
        });
    };

    private renderHiddenInput = (value: string) => (
        <input
            key={value}
            type="hidden"
            name={this.props.name}
            value={value}
            disabled={this.props.disabled}
        />
    );

    render() {
        const {
            className,
            id,
            name: _name,
            value: _value,
            defaultValue: _defaultValue,
            placeholder = 'Select an item…',
            disabled,
            multiple,
            onChange: _onChange,
            onClick: _onClick,
            menuClassName,
            children,
            controlSize,
            search,
            searchNormalize: _searchNormalize,
            searchPlaceholder = 'Search…',
            noResultsText = 'No results found',
            validation,
            ...props
        } = this.props;
        const options = collectOptions(children);
        const selected = options.filter(option => this.values.includes(option.props.value));
        const hasSelection = selected.length > 0 || Boolean(this.selectedLabel);
        const label =
            multiple && selected.length > 1
                ? `${selected.length} selected`
                : (selected[0]?.props.children ?? this.selectedLabel);
        const noResults = this.visibleOptionCount === 0;

        return (
            <div {...props} className={classNames('combobox', className)}>
                <Menu
                    ref={this.menu}
                    id={id ? `${id}-combobox` : undefined}
                    label={
                        <>
                            <span
                                className={classNames(
                                    'combobox-value',
                                    !hasSelection && 'combobox-placeholder'
                                )}
                            >
                                {hasSelection ? label : placeholder}
                            </span>
                            <Icon
                                name="chevron-down"
                                className="combobox-caret"
                                aria-hidden="true"
                            />
                        </>
                    }
                    toggleProps={{
                        id,
                        className: classNames(
                            'form-control combobox-toggle',
                            controlSize && `form-control-${controlSize}`,
                            validation && `is-${validation}`
                        ),
                        variant: 'text',
                        disabled,
                        'aria-haspopup': 'listbox',
                        'aria-label': this.props['aria-label'] ?? placeholder,
                        'aria-labelledby': this.props['aria-labelledby'],
                        'aria-describedby': this.props['aria-describedby'],
                        'aria-invalid': validation
                            ? validation === 'invalid'
                            : this.props['aria-invalid']
                    }}
                    autoClose={!multiple}
                    menuClassName={classNames(menuClassName, 'combobox-menu')}
                    onClick={this.handleClick}
                >
                    {search && (
                        <div className="combobox-search">
                            <input
                                type="search"
                                className="form-control combobox-search-input"
                                aria-label={searchPlaceholder}
                                placeholder={searchPlaceholder}
                                autoComplete="off"
                                value={this.query}
                                onChange={this.handleSearch}
                            />
                        </div>
                    )}
                    {Children.map(children, this.renderChild)}
                    {search && noResults && (
                        <div className="combobox-empty" role="status">
                            {noResultsText}
                        </div>
                    )}
                </Menu>

                {this.values.length || multiple
                    ? this.values.map(this.renderHiddenInput)
                    : this.renderHiddenInput('')}
            </div>
        );
    }
}
