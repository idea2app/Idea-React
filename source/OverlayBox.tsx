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
import { uniqueID } from 'web-utility';

import { OverlayPlacement } from './Overlay';
import { Popover } from './Popover';
import { Tooltip } from './Tooltip';

export type { OverlayPlacement };

export type OverlayTrigger = 'click' | 'focus' | 'hover';

export interface OverlayBoxProps extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    'children' | 'title'
> {
    children: ReactElement<{ 'aria-describedby'?: string }>;
    title: ReactNode;
    detail?: ReactNode;
    placement?: OverlayPlacement;
    trigger?: OverlayTrigger | OverlayTrigger[];
    delay?: number | { show: number; hide: number };
    overlayClassName?: string;
}

const PLACEMENT_CLASSES: Record<OverlayPlacement, string> = {
    top: 'bottom-100 start-50 translate-middle-x',
    right: 'top-50 start-100 translate-middle-y',
    bottom: 'top-100 start-50 translate-middle-x',
    left: 'top-50 end-100 translate-middle-y'
};

@observer
export class OverlayBox extends Component<OverlayBoxProps> {
    static displayName = 'OverlayBox';

    @observable accessor open = false;

    id = uniqueID();
    root = createRef<HTMLSpanElement>();
    timer?: ReturnType<typeof setTimeout>;

    @action
    setOpen = (open: boolean) => {
        this.open = open;
    };

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
    }

    componentDidMount() {
        document.addEventListener('pointerdown', this.handleOutside);
    }

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
        if (this.hasTrigger('hover')) this.setOpenAfterDelay(true);
    };

    handleMouseLeave = (event: MouseEvent<HTMLSpanElement>) => {
        this.props.onMouseLeave?.(event);
        if (this.hasTrigger('hover') && !this.root.current?.contains(document.activeElement))
            this.setOpenAfterDelay(false);
    };

    handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
        this.props.onFocus?.(event);
        if (this.hasTrigger('focus')) this.setOpenAfterDelay(true);
    };

    handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
        this.props.onBlur?.(event);
        if (this.hasTrigger('focus') && !event.currentTarget.contains(event.relatedTarget))
            this.setOpenAfterDelay(false);
    };

    handleClick = (event: MouseEvent<HTMLSpanElement>) => {
        this.props.onClick?.(event);
        if (!event.defaultPrevented && this.hasTrigger('click')) this.setOpenAfterDelay(!this.open);
    };

    handleOutside = ({ target }: PointerEvent) => {
        if (target instanceof Node && !this.root.current?.contains(target)) this.hide();
    };

    handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
        this.props.onKeyDown?.(event);
        if (event.key === 'Escape' && this.open) {
            event.preventDefault();
            this.hide();
        }
    };

    render() {
        const {
            title,
            detail,
            placement = 'top',
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
        const position = PLACEMENT_CLASSES[placement];
        const overlayClass = classNames('position-absolute w-max', position, overlayClassName);
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
                {this.open &&
                    (detail ? (
                        <Popover
                            id={id}
                            className={overlayClass}
                            title={title}
                            placement={placement}
                        >
                            {detail}
                        </Popover>
                    ) : (
                        <Tooltip id={id} className={overlayClass} placement={placement}>
                            {title}
                        </Tooltip>
                    ))}
            </span>
        );
    }
}
