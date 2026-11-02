'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    cloneElement,
    Component,
    createRef,
    FocusEvent,
    HTMLAttributes,
    isValidElement,
    KeyboardEvent,
    MouseEvent,
    ReactElement,
    ReactNode
} from 'react';
import { createPortal } from 'react-dom';
import { uniqueID } from 'web-utility';

import { FloatingOptions, FloatingPosition, OverlayContainer, OverlayPlacement } from './Overlay';
import { Popover } from './Popover';
import { Tooltip } from './Tooltip';

export type OverlayTrigger = 'click' | 'focus' | 'hover';

export interface OverlayBoxProps extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    'children' | 'title'
> {
    title: ReactNode;
    detail?: ReactNode;
    placement?: OverlayPlacement;
    responsivePlacement?: FloatingOptions['responsivePlacement'];
    container?: OverlayContainer;
    offset?: FloatingOptions['offset'];
    padding?: number;
    flip?: boolean;
    trigger?: OverlayTrigger | OverlayTrigger[];
    delay?: number | { show: number; hide: number };
    overlayClassName?: string;
    children: ReactElement<{ 'aria-describedby'?: string }>;
}

@observer
export class OverlayBox extends Component<OverlayBoxProps> {
    static displayName = 'OverlayBox';

    @observable accessor open = false;

    id = uniqueID();
    root = createRef<HTMLSpanElement>();
    overlay = createRef<HTMLDivElement>();
    position = new FloatingPosition();
    timer?: ReturnType<typeof setTimeout>;

    @action
    setOpen = (open: boolean) => (this.open = open);

    hide = () => {
        clearTimeout(this.timer);
        this.setOpen(false);
    };

    setOpenAfterDelay = (open: boolean) => {
        clearTimeout(this.timer);

        const { delay } = this.props;
        const timeout = typeof delay === 'number' ? delay : delay?.[open ? 'show' : 'hide'];

        if (!timeout) return this.setOpen(open);

        this.timer = setTimeout(() => this.setOpen(open), timeout);
    };

    componentWillUnmount() {
        document.removeEventListener('pointerdown', this.handleOutside);
        clearTimeout(this.timer);
        this.position.dispose();
    }

    componentDidMount() {
        document.addEventListener('pointerdown', this.handleOutside);
    }

    componentDidUpdate(previous: OverlayBoxProps) {
        const { open, root, overlay, props, position } = this;
        const {
            placement = 'top',
            responsivePlacement,
            offset = props.detail == null ? 8 : 12,
            padding,
            flip,
            container
        } = props;
        if (!open) return position.dispose();
        if (!root.current || !overlay.current) return;
        if (
            position.element !== overlay.current ||
            previous.placement !== props.placement ||
            previous.responsivePlacement !== responsivePlacement ||
            previous.offset !== props.offset ||
            previous.padding !== padding ||
            previous.flip !== flip ||
            previous.container !== container
        )
            position.attach(root.current, overlay.current, {
                placement,
                responsivePlacement,
                offset,
                padding,
                flip
            });
        else position.update();
    }

    contains = (target: EventTarget | null) =>
        target instanceof Node &&
        (!!this.root.current?.contains(target) || !!this.overlay.current?.contains(target));

    hasTrigger = (trigger: OverlayTrigger) => {
        const triggers: OverlayTrigger[] = this.props.trigger
            ? Array.isArray(this.props.trigger)
                ? this.props.trigger
                : [this.props.trigger]
            : ['hover', 'focus'];

        return triggers.includes(trigger);
    };

    handleMouseEnter = (event: MouseEvent<HTMLSpanElement>) => {
        this.props.onMouseEnter?.(event);

        if (!event.defaultPrevented && this.hasTrigger('hover')) this.setOpenAfterDelay(true);
    };

    handleMouseLeave = (event: MouseEvent<HTMLSpanElement>) => {
        this.props.onMouseLeave?.(event);

        if (
            !event.defaultPrevented &&
            this.hasTrigger('hover') &&
            !this.contains(event.relatedTarget) &&
            !this.contains(document.activeElement)
        )
            this.setOpenAfterDelay(false);
    };

    handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
        this.props.onFocus?.(event);

        if (!event.defaultPrevented && this.hasTrigger('focus')) this.setOpenAfterDelay(true);
    };

    handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
        this.props.onBlur?.(event);

        if (
            !event.defaultPrevented &&
            this.hasTrigger('focus') &&
            !this.contains(event.relatedTarget)
        )
            this.setOpenAfterDelay(false);
    };

    handleClick = (event: MouseEvent<HTMLSpanElement>) => {
        this.props.onClick?.(event);

        if (
            !event.defaultPrevented &&
            this.hasTrigger('click') &&
            !(event.target instanceof Node && this.overlay.current?.contains(event.target))
        )
            this.setOpenAfterDelay(!this.open);
    };

    handleOutside = ({ target }: PointerEvent) => {
        if (target instanceof Node && !this.contains(target)) this.hide();
    };

    handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
        this.props.onKeyDown?.(event);

        if (!event.defaultPrevented && event.key === 'Escape' && this.open) {
            event.preventDefault();
            this.hide();
        }
    };

    render() {
        const {
            title,
            detail,
            placement = 'top',
            responsivePlacement: _responsivePlacement,
            container,
            offset: _offset,
            padding: _padding,
            flip: _flip,
            trigger: _trigger,
            delay: _delay,
            overlayClassName,
            children,
            className = '',
            onMouseEnter: _onMouseEnter,
            onMouseLeave: _onMouseLeave,
            onFocus: _onFocus,
            onBlur: _onBlur,
            onClick: _onClick,
            onKeyDown: _onKeyDown,
            ...props
        } = this.props;
        const id = this.open ? this.id : undefined;
        const direction = this.position.element
            ? (this.position.placement.split('-')[0] as OverlayPlacement)
            : placement;
        const overlayClass = classNames('w-max', overlayClassName);
        const overlay =
            detail != null ? (
                <Popover
                    ref={this.overlay}
                    id={id}
                    style={{ ...this.position.style }}
                    arrowStyle={{ ...this.position.arrowStyle }}
                    className={overlayClass}
                    title={title}
                    placement={direction}
                >
                    {detail}
                </Popover>
            ) : (
                <Tooltip
                    ref={this.overlay}
                    id={id}
                    style={{ ...this.position.style }}
                    arrowStyle={{ ...this.position.arrowStyle }}
                    className={overlayClass}
                    placement={direction}
                >
                    {title}
                </Tooltip>
            );
        const target =
            this.open && container
                ? typeof container === 'string'
                    ? document.querySelector<HTMLElement>(container)
                    : typeof container === 'function'
                      ? container()
                      : container
                : undefined;
        if (this.open && container && !target) throw new Error('Overlay container was not found');
        const trigger = isValidElement(children)
            ? cloneElement(children, {
                  'aria-describedby':
                      [children.props['aria-describedby'], id].filter(Boolean).join(' ') ||
                      undefined
              })
            : children;

        return (
            <span
                {...props}
                ref={this.root}
                className={`position-relative d-inline-block ${className}`}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
            >
                {trigger}

                {this.open && (target ? createPortal(overlay, target) : overlay)}
            </span>
        );
    }
}
