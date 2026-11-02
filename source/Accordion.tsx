'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ComponentPropsWithoutRef, ComponentPropsWithRef, FC, MouseEvent } from 'react';

import { Button, ButtonProps, ComponentTheme } from './Button';
import { Icon } from './Icon';

export interface AccordionProps extends ComponentPropsWithRef<'div'> {
    theme?: ComponentTheme;
    size?: 'sm';
    flush?: boolean;
    gap?: boolean;
}

export const Accordion: FC<AccordionProps> = ({ theme, size, flush, gap, className, ...props }) => (
    <div
        {...props}
        className={classNames(
            'accordion',
            theme && `theme-${theme}`,
            size && `accordion-${size}`,
            { 'accordion-flush': flush, 'accordion-gap': gap },
            className
        )}
    />
);

export const AccordionItem: FC<ComponentPropsWithRef<'details'>> = ({ className, ...props }) => (
    <details {...props} className={classNames('accordion-item', className)} />
);

export interface AccordionHeaderProps extends ComponentPropsWithRef<'summary'> {
    icon?: string | false;
}

export const AccordionHeader: FC<AccordionHeaderProps> = ({
    icon = 'chevron-down',
    className,
    children,
    ...props
}) => (
    <summary {...props} className={classNames('accordion-header', className)}>
        {children}
        {icon && <Icon name={icon} className="accordion-icon" aria-hidden="true" />}
    </summary>
);

export const AccordionBody: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('accordion-body', className)} />
);

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionHeader.displayName = 'AccordionHeader';
AccordionBody.displayName = 'AccordionBody';

export interface AccordionToggleProps
    extends
        ComponentPropsWithoutRef<'button'>,
        Pick<ButtonProps, 'variant' | 'theme' | 'size' | 'styled' | 'icon'> {
    target: string;
}

@observer
export class AccordionToggle extends Component<AccordionToggleProps> {
    static displayName = 'AccordionToggle';

    @observable accessor expanded = false;

    names = new Map<HTMLDetailsElement, string>();

    get items() {
        return [
            ...(document
                .querySelector(this.props.target)
                ?.querySelectorAll<HTMLDetailsElement>(':scope > .accordion-item') ?? [])
        ];
    }

    componentDidMount() {
        document.addEventListener('toggle', this.refresh, true);
        this.refresh();
    }

    componentDidUpdate(previous: AccordionToggleProps) {
        if (previous.target !== this.props.target) {
            this.restoreNames();
            this.refresh();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('toggle', this.refresh, true);
        this.restoreNames();
    }

    restoreNames = () => {
        for (const [item, name] of this.names) item.setAttribute('name', name);
        this.names.clear();
    };

    refresh = action(() => {
        const { items } = this;

        this.expanded = !!items.length && items.every(({ open }) => open);
    });

    handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        this.props.onClick?.(event);

        if (event.defaultPrevented) return;

        const { items, expanded } = this;

        for (const item of items) {
            const name = item.getAttribute('name');

            if (!expanded && name) {
                this.names.set(item, name);
                item.removeAttribute('name');
            }
            item.open = !expanded;
        }
        if (expanded) this.restoreNames();

        this.refresh();
    };

    render() {
        const { target: _target, ...props } = this.props;

        return <Button {...props} aria-expanded={this.expanded} onClick={this.handleClick} />;
    }
}
