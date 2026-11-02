'use client';

import classNames from 'classnames';
import { observer } from 'mobx-react';
import {
    cloneElement,
    ComponentPropsWithRef,
    FC,
    FocusEvent,
    KeyboardEventHandler,
    ReactElement
} from 'react';

import { Button, ButtonProps } from '../Button';
import { Menu, MenuProps } from '../Menu';

export type InputGroupProps = ComponentPropsWithRef<'div'> & {
    size?: 'sm' | 'lg';
};

export const InputGroup: FC<InputGroupProps> = ({ className, size, ...props }) => (
    <div
        {...props}
        className={classNames('input-group', size && `input-group-${size}`, className)}
    />
);

InputGroup.displayName = 'InputGroup';

export type InputGroupTextProps = ComponentPropsWithRef<'span'>;

export const InputGroupText: FC<InputGroupTextProps> = ({ className, ...props }) => (
    <span {...props} className={classNames('input-group-text', className)} />
);

InputGroupText.displayName = 'InputGroupText';

export type InputGroupButtonProps = ButtonProps;

export const InputGroupButton: FC<InputGroupButtonProps> = ({ className, ...props }) => (
    <Button {...props} className={classNames('input-group-btn', className)} />
);

InputGroupButton.displayName = 'InputGroupButton';

export interface InputGroupIgnoreProps {
    children: ReactElement<{ className?: string }>;
}

export const InputGroupIgnore: FC<InputGroupIgnoreProps> = ({ children }) =>
    cloneElement(children, {
        className: classNames('input-group-ignore', children.props.className)
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
        owner,
        id,
        label,
        split,
        toggleProps,
        className,
        children,
        align = 'end',
        menuClassName
    }) => {
        const { open } = owner;

        return (
            <>
                <Button
                    {...toggleProps}
                    ref={owner.trigger}
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
                    onClick={owner.handleToggle}
                    onKeyDown={owner.handleTriggerKeyDown}
                    onBlur={owner.handleBlur}
                >
                    {label}
                </Button>

                <div
                    ref={owner.panel}
                    id={id ? `${id}-menu` : undefined}
                    className={classNames(
                        'menu top-100',
                        align === 'end' ? 'end-0' : 'start-0',
                        open && 'show',
                        menuClassName
                    )}
                    hidden={!open}
                    onClick={owner.handlePanelClick}
                    onKeyDown={owner.handleKeyDown}
                    onBlur={owner.handleBlur}
                >
                    {children}
                </div>
            </>
        );
    }
);
