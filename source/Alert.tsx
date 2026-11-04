'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    Component,
    ComponentPropsWithoutRef,
    ComponentPropsWithRef,
    createRef,
    ElementType,
    MouseEvent,
    TransitionEvent
} from 'react';

import { ComponentTheme } from './Button';
import { CloseButton } from './CloseButton';
import { AsProps, polymorphic, PolymorphicClassProps } from './Polymorphic';

export interface AlertProps extends ComponentPropsWithoutRef<'div'> {
    theme?: ComponentTheme;
    dismissible?: boolean;
    instant?: boolean;
    closeLabel?: string;
    onClose?: () => unknown;
    onClosed?: () => unknown;
}

@observer
export class Alert<T extends ElementType | undefined = 'div'> extends Component<
    PolymorphicClassProps<T, AlertProps>
> {
    declare readonly props: PolymorphicClassProps<T, AlertProps>;

    protected get componentProps(): Readonly<AlertProps & AsProps> {
        return this.props;
    }

    static displayName = 'Alert';

    @observable accessor hiding = false;
    @observable accessor closed = false;

    root = createRef<HTMLDivElement>();
    timer?: ReturnType<typeof setTimeout>;
    notified = false;

    componentDidUpdate() {
        if (this.closed && !this.notified) {
            this.notified = true;
            this.componentProps.onClosed?.();
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

        this.componentProps.onClose?.();

        if (this.componentProps.instant) return this.finishClose();

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
        this.componentProps.onTransitionEnd?.(event);

        if (event.target === event.currentTarget && this.hiding) this.finishClose();
    };

    render() {
        const Root: ElementType = this.componentProps.as ?? 'div';

        const {
            as: _as,
            theme,
            dismissible,
            instant,
            closeLabel = 'Close',
            onClose: _onClose,
            onClosed: _onClosed,
            className,
            children,
            ...props
        } = this.componentProps;

        return this.closed ? null : (
            <Root
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
            </Root>
        );
    }
}

export const AlertLink = polymorphic<ComponentPropsWithRef<'a'>>(
    ({ as: Root = 'a', className, ...props }) => (
        <Root {...props} className={classNames('alert-link', className)} />
    )
);
AlertLink.displayName = 'AlertLink';

export const AlertHeading = polymorphic<ComponentPropsWithRef<'h4'>>(
    ({ as: Root = 'h4', className, ...props }) => (
        <Root {...props} className={classNames('alert-heading', className)} />
    )
);
AlertHeading.displayName = 'AlertHeading';
