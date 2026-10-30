import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    Component,
    createRef,
    FocusEvent,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    ReactNode
} from 'react';
import { uniqueID } from 'web-utility';

export type OverlayTrigger = 'click' | 'focus' | 'hover';
export type OverlayPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface OverlayBoxProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'title'> {
    title: ReactNode;
    detail?: ReactNode;
    placement?: OverlayPlacement;
    trigger?: OverlayTrigger | OverlayTrigger[];
    delay?: number | { show: number; hide: number };
}

const PLACEMENT_CLASSES: Record<OverlayPlacement, string> = {
    top: 'bottom-100 start-50 translate-middle-x',
    right: 'top-50 start-100 translate-middle-y',
    bottom: 'top-100 start-50 translate-middle-x',
    left: 'top-50 end-100 translate-middle-y'
};

const PLACEMENT_DIRECTIONS: Record<OverlayPlacement, string> = {
    top: 'top',
    right: 'end',
    bottom: 'bottom',
    left: 'start'
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
        if (target instanceof Node && !this.root.current?.contains(target)) this.setOpen(false);
    };

    handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
        this.props.onKeyDown?.(event);
        if (event.key === 'Escape' && this.open) {
            event.preventDefault();
            this.setOpen(false);
        }
    };

    render() {
        const {
            title,
            detail,
            placement = 'top',
            trigger: _trigger,
            delay: _delay,
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
        const direction = PLACEMENT_DIRECTIONS[placement];
        const position = PLACEMENT_CLASSES[placement];

        return (
            <span
                {...props}
                ref={this.root}
                className={`position-relative d-inline-block ${className}`}
                aria-describedby={id}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
            >
                {children}
                {this.open &&
                    (detail ? (
                        <div
                            id={id}
                            className={`popover show bs-popover-${direction} position-absolute ${position}`}
                            role="dialog"
                            data-bs-placement={placement}
                        >
                            <div className="popover-arrow" />
                            <div className="popover-header">{title}</div>
                            <div className="popover-body">{detail}</div>
                        </div>
                    ) : (
                        <div
                            id={id}
                            className={`tooltip show bs-tooltip-${direction} position-absolute ${position}`}
                            role="tooltip"
                            data-bs-placement={placement}
                        >
                            <div className="tooltip-arrow" />
                            <div className="tooltip-inner">{title}</div>
                        </div>
                    ))}
            </span>
        );
    }
}
