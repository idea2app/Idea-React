'use client';

import classNames from 'classnames';
import { observer } from 'mobx-react';
import {
    cloneElement,
    ComponentPropsWithRef,
    createElement,
    FC,
    FocusEvent,
    KeyboardEventHandler,
    ReactElement
} from 'react';

import { Button, ButtonProps } from '../Base/Button';
import { Menu, MenuProps } from '../Base/Menu';
import { polymorphic } from '../Helper/Polymorphic';

export type InputGroupProps = ComponentPropsWithRef<'div'> & {
    size?: 'sm' | 'lg';
};

export const InputGroup = polymorphic<InputGroupProps>(
    ({ as: Root = 'div', className, size, ...props }) => (
        <Root
            {...props}
            className={classNames('input-group', size && `input-group-${size}`, className)}
        />
    )
);
InputGroup.displayName = 'InputGroup';

export type InputGroupTextProps =
    | (ComponentPropsWithRef<'span'> & { htmlFor?: never })
    | (ComponentPropsWithRef<'label'> & { htmlFor: string });

export const InputGroupText = polymorphic<InputGroupTextProps>(
    ({ as: RootAs, className, ...props }) => {
        const Root = RootAs ?? (typeof props.htmlFor === 'string' ? 'label' : 'span');

        return <Root {...props} className={classNames('input-group-text', className)} />;
    }
);
InputGroupText.displayName = 'InputGroupText';

export type InputGroupButtonProps = ButtonProps;

export const InputGroupButton = polymorphic<InputGroupButtonProps>(
    ({ as: RootAs, className, ...props }) => (
        <Button as={RootAs} {...props} className={classNames('input-group-btn', className)} />
    )
);
InputGroupButton.displayName = 'InputGroupButton';

export interface InputGroupIgnoreProps {
    children: ReactElement<{ className?: string }>;
}

export const InputGroupIgnore = polymorphic<InputGroupIgnoreProps>(({ as, children, ...props }) => {
    const attributes = {
        ...children.props,
        ...props,
        className: classNames('input-group-ignore', children.props.className)
    };

    return as ? createElement(as, attributes) : cloneElement(children, attributes);
});

InputGroupIgnore.displayName = 'InputGroupIgnore';

export interface InputGroupMenuProps extends MenuProps {
    split?: boolean;
}

export class InputGroupMenu extends Menu {
    declare props: InputGroupMenuProps;

    static displayName = 'InputGroupMenu';

    componentDidMount() {
        this.root.current = this.trigger.current?.closest<HTMLDivElement>('.input-group') ?? null;
        super.componentDidMount();
    }

    handlePanelClick: ComponentPropsWithRef<'div'>['onClick'] = event => {
        this.props.onClick?.(event);

        if (!event.defaultPrevented) this.handleSelect(event);
    };

    handleTriggerKeyDown: KeyboardEventHandler<HTMLElement> = this.handleKeyDown;

    handleBlur = (event: FocusEvent<HTMLElement>) => {
        this.props.onBlur?.(event as FocusEvent<HTMLDivElement>);

        const { autoClose = true } = this.props;
        if (
            !event.defaultPrevented &&
            autoClose !== false &&
            autoClose !== 'inside' &&
            !this.root.current?.contains(event.relatedTarget)
        )
            this.setOpen(false);
    };

    render() {
        return <InputGroupMenuView {...this.props} owner={this} />;
    }
}

const InputGroupMenuView = observer<FC<InputGroupMenuProps & { owner: InputGroupMenu }>>(
    ({
        owner: {
            open,
            trigger,
            panel,
            handleToggle,
            handleTriggerKeyDown,
            handleBlur,
            handlePanelClick,
            handleKeyDown
        },
        id,
        label,
        split,
        toggleProps,
        className,
        children,
        align = 'end',
        menuClassName
    }) => (
        <>
            <Button
                {...toggleProps}
                ref={trigger}
                className={classNames(
                    'input-group-btn',
                    split && 'menu-toggle-split',
                    toggleProps?.className,
                    className
                )}
                aria-label={
                    split
                        ? (toggleProps?.['aria-label'] ?? 'Toggle menu')
                        : toggleProps?.['aria-label']
                }
                aria-expanded={open}
                aria-controls={id ? `${id}-menu` : undefined}
                onClick={handleToggle}
                onKeyDown={handleTriggerKeyDown}
                onBlur={handleBlur}
            >
                {label}
            </Button>

            <div
                ref={panel}
                id={id ? `${id}-menu` : undefined}
                className={classNames(
                    'menu top-100',
                    align === 'end' ? 'end-0' : 'start-0',
                    open && 'show',
                    menuClassName
                )}
                hidden={!open}
                onClick={handlePanelClick}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            >
                {children}
            </div>
        </>
    )
);
