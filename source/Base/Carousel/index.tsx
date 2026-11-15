'use client';

import classNames from 'classnames';
import { action, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import {
    Children,
    cloneElement,
    Component,
    ComponentPropsWithRef,
    createRef,
    CSSProperties,
    ElementType,
    isValidElement,
    KeyboardEvent,
    MouseEvent,
    PointerEvent,
    ReactNode,
    WheelEvent
} from 'react';

import { Icon } from '../../Extension/Icon';
import { polymorphic, PolymorphicClassProps } from '../../Helper/Polymorphic';
import { Button } from '../Button';
import {
    CarouselEnds,
    CarouselModel,
    CarouselModelOptions,
    FadeCarouselModel,
    ScrollCarouselModel
} from './model';
import { CarouselScroll } from './scroll';
import styles from './style.module.css';

export interface CarouselSlideProps extends ComponentPropsWithRef<'div'> {
    interval?: number;
    active?: boolean;
}

export const CarouselSlide = polymorphic<CarouselSlideProps>(
    ({ as: Root = 'div', interval, active, className, children, ...props }) => (
        <Root
            {...props}
            className={classNames('carousel-item', { active }, className)}
            data-bs-interval={interval}
        >
            {children}
        </Root>
    )
);

CarouselSlide.displayName = 'CarouselSlide';

export interface CarouselProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
    auto?: boolean;
    autoplay?: boolean;
    center?: boolean;
    controls?: boolean;
    controlsPlacement?: 'overlay' | 'top' | 'bottom';
    controlsClassName?: string;
    controlsStart?: ReactNode;
    dark?: boolean;
    ends?: CarouselEnds;
    fade?: boolean;
    indicators?: boolean;
    indicatorPlacement?: 'start' | 'end' | 'between';
    innerClassName?: string;
    interval?: number;
    items?: number;
    itemsGap?: string | number;
    itemsPeek?: string | number;
    keyboard?: boolean;
    onChange?: (index: number) => unknown;
    pause?: boolean | 'hover';
    playPause?: boolean;
}

@observer
export class Carousel<T extends ElementType | undefined = 'div'> extends Component<
    PolymorphicClassProps<T, CarouselProps>
> {
    declare readonly props: PolymorphicClassProps<T, CarouselProps>;

    static displayName = 'Carousel';

    root = createRef<HTMLDivElement>();

    track = createRef<HTMLDivElement>();

    scroller = new CarouselScroll();

    @observable accessor store: CarouselModel = this.createStore();

    private stopMotion?: () => void;

    componentDidMount() {
        this.stopMotion = reaction(() => this.store.motion, this.scroller.apply);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        this.handleVisibilityChange();
        this.updateStore();
        if (this.props.autoplay) this.store.play();
    }

    componentDidUpdate() {
        this.updateStore();

        const focused = document.activeElement;
        if (
            focused instanceof HTMLButtonElement &&
            focused.disabled &&
            this.root.current?.contains(focused)
        ) {
            const action = focused.dataset.carouselAction === 'next' ? 'previous' : 'next';
            this.root.current
                .querySelector<HTMLButtonElement>(`[data-carousel-action="${action}"]`)
                ?.focus();
        }
    }

    componentWillUnmount() {
        this.stopMotion?.();
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        this.scroller.dispose();
        this.store.dispose();
    }

    private getSlides = () => Children.toArray(this.props.children);

    private get modelOptions(): CarouselModelOptions {
        const { ends = 'loop', interval = 5000, onChange } = this.props;
        const intervals = Children.toArray(this.props.children).map(slide =>
            isValidElement<CarouselSlideProps>(slide)
                ? (slide.props.interval ?? interval)
                : interval
        );

        return { intervals, ends, onChange };
    }

    private createStore() {
        return this.props.fade
            ? new FadeCarouselModel(this.modelOptions)
            : new ScrollCarouselModel(this.modelOptions);
    }

    private updateStore = action(() => {
        if (Boolean(this.props.fade) !== this.store.fade) {
            const previous = this.store;
            const next = this.createStore();
            next.restore(previous);
            previous.dispose();
            this.scroller.dispose();
            this.store = next;
        } else this.store.update(this.modelOptions);

        const root = this.root.current;
        const track = this.track.current;
        if (this.store.fade) this.store.refresh();
        else if (root && track)
            this.scroller.mount(
                root,
                track,
                {
                    onLayout: this.store.refresh,
                    onScroll: this.store.syncScroll,
                    onComplete: this.store.complete,
                    onResize: this.handleResize
                },
                this.props.center
            );
        this.store.mount();
    });

    private handleVisibilityChange = () => this.store.setVisible(!document.hidden);

    private handleResize = () => {
        this.store.interrupt();
        this.scroller.refresh(true);
    };

    handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        this.props.onPointerDown?.(event);
        if (!event.defaultPrevented) this.store.interrupt();
    };

    handleWheel = (event: WheelEvent<HTMLDivElement>) => {
        this.props.onWheel?.(event);
        if (!event.defaultPrevented) this.store.interrupt();
    };

    handleMouseEnter = () => {
        if (this.props.pause !== false) this.store.setHovering(true);
    };

    handleMouseLeave = () => this.store.setHovering(false);

    handleFocusCapture = () => {
        if (this.props.pause !== false) this.store.setHovering(true);
    };

    handleBlurCapture = ({ currentTarget, relatedTarget }: React.FocusEvent<HTMLDivElement>) => {
        if (relatedTarget instanceof Node && currentTarget.contains(relatedTarget)) return;

        this.store.setHovering(false);
    };

    handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        this.props.onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (this.props.keyboard === false || event.altKey || event.ctrlKey || event.metaKey) return;
        if (
            event.target instanceof HTMLElement &&
            /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)
        )
            return;

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.store.previous(true);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.store.next(true);
        }
    };

    handleClick = (event: MouseEvent<HTMLDivElement>) => {
        this.props.onClick?.(event);
        if (event.defaultPrevented) return;

        const button =
            event.target instanceof Element
                ? event.target.closest<HTMLButtonElement>('[data-carousel-action]')
                : null;
        const { carouselAction, index } = button?.dataset ?? {};

        switch (carouselAction) {
            case 'previous':
                this.store.previous(true);
                break;
            case 'next':
                this.store.next(true);
                break;
            case 'slide':
                if (index !== undefined) this.store.setIndex(Number(index), true);
                break;
            case 'toggle':
                this.store.toggle();
        }
    };

    renderSlide = (slide: ReactNode, index: number) => {
        const active = this.store.activeIndex === index;

        return isValidElement<CarouselSlideProps>(slide) && typeof slide.type !== 'string' ? (
            cloneElement(slide, { active, 'aria-hidden': !active })
        ) : (
            <CarouselSlide key={index} active={active} aria-hidden={!active}>
                {slide}
            </CarouselSlide>
        );
    };

    renderControl = (direction: 'previous' | 'next') => {
        const { controls = true } = this.props;
        if (!controls) return null;

        const previous = direction === 'previous';
        const disabled = previous ? !this.store.canPrevious : !this.store.canNext;
        const overlay = (this.props.controlsPlacement ?? 'overlay') === 'overlay';
        const label = previous ? 'Previous' : 'Next';

        return (
            <Button
                variant={overlay ? 'subtle' : undefined}
                theme={overlay ? 'secondary' : undefined}
                size="sm"
                data-carousel-action={direction}
                aria-label={label}
                disabled={disabled}
                icon
            >
                <Icon name={previous ? 'chevron-left' : 'chevron-right'} size={1} />
                <span className="visually-hidden">{label}</span>
            </Button>
        );
    };

    renderIndicators = () =>
        this.props.indicators && this.getSlides().length > 1 ? (
            <div className="carousel-indicators">
                {this.store.indexes.map(index => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target={this.props.id ? `#${this.props.id}` : ''}
                        data-carousel-action="slide"
                        data-index={index}
                        aria-label={`Slide ${index + 1}`}
                        aria-current={this.store.activeIndex === index ? 'true' : undefined}
                        className={classNames({ active: this.store.activeIndex === index })}
                    />
                ))}
            </div>
        ) : null;

    renderPlayPause = () =>
        (this.props.playPause || this.props.autoplay) && (
            <Button
                className={classNames('carousel-control-play-pause', {
                    paused: !this.store.playing
                })}
                size="sm"
                data-carousel-action="toggle"
                aria-label={this.store.playing ? 'Pause' : 'Play'}
                icon
            >
                <Icon name={this.store.playing ? 'pause-fill' : 'play-fill'} size={1} />
            </Button>
        );

    renderControls = () => {
        const {
            controls = true,
            controlsPlacement = 'overlay',
            controlsClassName = 'd-flex justify-content-between align-items-center',
            controlsStart,
            indicators,
            indicatorPlacement = 'start',
            autoplay,
            playPause
        } = this.props;
        if (!controls && !indicators && !autoplay && !playPause && !controlsStart) return null;

        const split = indicatorPlacement === 'between';
        const previous = this.renderControl('previous');
        const next = this.renderControl('next');
        const buttons = (
            <>
                {this.renderPlayPause()}
                {previous}
                {next}
            </>
        );

        return (
            <div
                className={
                    controlsPlacement === 'overlay'
                        ? 'carousel-overlay-controls'
                        : controlsClassName
                }
            >
                {controlsStart}
                {indicatorPlacement === 'start' && this.renderIndicators()}
                {split ? previous : <div className="d-inline-flex gap-1">{buttons}</div>}
                {indicatorPlacement !== 'start' && this.renderIndicators()}
                {split && this.renderPlayPause()}
                {split && next}
            </div>
        );
    };

    render() {
        const Root: ElementType = this.props.as ?? 'div';

        const slides = this.getSlides();
        const {
            as: _as,
            auto,
            autoplay: _autoplay,
            center,
            children: _children,
            className,
            controls: _controls,
            controlsPlacement = 'overlay',
            controlsClassName: _controlsClassName,
            controlsStart: _controlsStart,
            dark,
            ends: _ends,
            fade,
            indicators: _indicators,
            indicatorPlacement: _indicatorPlacement,
            innerClassName,
            interval: _interval,
            items,
            itemsGap,
            itemsPeek,
            keyboard: _keyboard,
            onChange: _onChange,
            onClick: _onClick,
            onPointerDown: _onPointerDown,
            onWheel: _onWheel,
            pause: _pause,
            playPause: _playPause,
            style,
            ...props
        } = this.props;
        const placement = controlsPlacement === 'overlay';
        const styleWithItems = {
            ...style,
            ...(items && { '--bs-carousel-items': items }),
            ...(itemsGap !== undefined && { '--bs-carousel-items-gap': itemsGap }),
            ...(itemsPeek !== undefined && { '--bs-carousel-items-peek': itemsPeek }),
            ...(this.store.playing && {
                '--bs-carousel-interval': `${this.store.interval}ms`
            })
        } as CSSProperties;

        return (
            <Root
                {...props}
                ref={this.root}
                className={classNames(
                    'carousel',
                    {
                        'carousel-overlay': placement,
                        'carousel-auto': auto,
                        'carousel-fade': fade,
                        'carousel-dark': dark,
                        'carousel-center': center,
                        'carousel-playing': this.store.playing,
                        [styles.paused]: this.store.playing && !this.store.cycling
                    },
                    className
                )}
                style={styleWithItems}
                role="region"
                aria-label={this.props['aria-label'] ?? 'Carousel'}
                aria-roledescription="carousel"
                {...(dark && { 'data-bs-theme': 'dark' })}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onFocusCapture={this.handleFocusCapture}
                onBlurCapture={this.handleBlurCapture}
                onPointerDown={this.handlePointerDown}
                onWheel={this.handleWheel}
            >
                {controlsPlacement === 'top' && this.renderControls()}
                <div
                    ref={this.track}
                    className={classNames('carousel-inner', innerClassName)}
                    tabIndex={0}
                    aria-label={this.props['aria-label'] ?? 'Carousel slides'}
                >
                    {slides.map(this.renderSlide)}
                </div>
                {controlsPlacement !== 'top' && this.renderControls()}
            </Root>
        );
    }
}
