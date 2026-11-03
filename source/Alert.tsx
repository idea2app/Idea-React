'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    Component,
    ComponentPropsWithoutRef,
    ComponentPropsWithRef,
    createRef,
    FC,
    MouseEvent,
    TransitionEvent
} from 'react';

import { ComponentTheme } from './Button';
import { CloseButton } from './CloseButton';

export interface AlertProps extends ComponentPropsWithoutRef<'div'> {
    theme?: ComponentTheme;
    dismissible?: boolean;
    instant?: boolean;
    closeLabel?: string;
    onClose?: () => unknown;
    onClosed?: () => unknown;
}

@observer
export class Alert extends Component<AlertProps> {
    static displayName = 'Alert';

    @observable accessor hiding = false;
    @observable accessor closed = false;

    root = createRef<HTMLDivElement>();
    timer?: ReturnType<typeof setTimeout>;
    notified = false;

    componentDidUpdate() {
        if (this.closed && !this.notified) {
            this.notified = true;
            this.props.onClosed?.();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    finishClose = action(() => {
        if (this.closed) return;

        clearTimeout(this.timer);
        this.closed = true;
    });

    close = action(() => {
        if (this.hiding || this.closed) return;

        this.props.onClose?.();

        if (this.props.instant) return this.finishClose();

        this.hiding = true;

        const style = getComputedStyle(this.root.current!);
        const durations = style.transitionDuration.split(',').map(Alert.milliseconds);
        const delays = style.transitionDelay.split(',').map(Alert.milliseconds);
        const timeout = Math.max(
            0,
            ...durations.map((duration, index) => duration + (delays[index % delays.length] || 0))
        );
        this.timer = setTimeout(this.finishClose, timeout);
    });

    static milliseconds = (value: string) =>
        (parseFloat(value) || 0) * (value.trim().endsWith('ms') ? 1 : 1000);

    handleClose = (event: MouseEvent<HTMLButtonElement>) => {
        if (!event.defaultPrevented) this.close();
    };

    handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
        this.props.onTransitionEnd?.(event);

        if (event.target === event.currentTarget && this.hiding) this.finishClose();
    };

    render() {
        const {
            theme,
            dismissible,
            instant,
            closeLabel = 'Close',
            onClose: _onClose,
            onClosed: _onClosed,
            className,
            children,
            ...props
        } = this.props;

        return this.closed ? null : (
            <div
                {...props}
                ref={this.root}
                role={props.role ?? 'alert'}
                className={classNames(
                    'alert',
                    theme && `theme-${theme}`,
                    { 'alert-instant': instant, hiding: this.hiding },
                    className
                )}
                onTransitionEnd={this.handleTransitionEnd}
            >
                {children}

                {dismissible && (
                    <CloseButton
                        className="ms-auto"
                        aria-label={closeLabel}
                        onClick={this.handleClose}
                    />
                )}
            </div>
        );
    }
}

export const AlertLink: FC<ComponentPropsWithRef<'a'>> = ({ className, ...props }) => (
    <a {...props} className={classNames('alert-link', className)} />
);

export const AlertHeading: FC<ComponentPropsWithRef<'h4'>> = ({ className, ...props }) => (
    <h4 {...props} className={classNames('alert-heading', className)} />
);

AlertLink.displayName = 'AlertLink';
AlertHeading.displayName = 'AlertHeading';
