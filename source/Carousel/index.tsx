'use client';

import classNames from 'classnames';
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
    ReactNode
} from 'react';

import { Icon } from '../Extension/Icon';
import { AsProps, polymorphic, PolymorphicClassProps } from '../Polymorphic';
import { CarouselEnds, CarouselModel } from './model';
import { CarouselScroll } from './scroll';

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
    autoplay?: boolean;
    center?: boolean;
    controls?: boolean;
    controlsPlacement?: 'overlay' | 'top' | 'bottom';
    dark?: boolean;
    ends?: CarouselEnds;
    fade?: boolean;
    indicators?: boolean;
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

    protected get componentProps(): Readonly<CarouselProps & AsProps> {
        return this.props;
    }

    static displayName = 'Carousel';

    root = createRef<HTMLDivElement>();

    track = createRef<HTMLDivElement>();

    store = new CarouselModel(0, 'loop', () => 5000);

    scroller = new CarouselScroll();

    componentDidMount() {
        this.updateStore();
        if (this.componentProps.autoplay) this.store.play();
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        this.track.current?.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    componentDidUpdate() {
        this.updateStore();
    }

    componentWillUnmount() {
        this.store.dispose();
        this.scroller.dispose();

        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        this.track.current?.removeEventListener('scroll', this.handleScroll);
    }

    private getSlides = () => Children.toArray(this.componentProps.children);

    private getSlideInterval = (index: number) => {
        const slide = this.getSlides()[index];
        const itemInterval = isValidElement<CarouselSlideProps>(slide)
            ? slide.props.interval
            : undefined;

        return itemInterval ?? this.componentProps.interval ?? 5000;
    };

    private updateStore = () => {
        const slides = this.getSlides();
        this.store.onChange = this.componentProps.onChange;
        this.store.onNavigate = this.scrollToActive;
        this.store.update(slides.length, this.componentProps.ends ?? 'loop', this.getSlideInterval);
    };

    handleVisibilityChange = () => this.store.setVisible(!document.hidden);

    handleMouseEnter = () => {
        if (this.componentProps.pause !== false) this.store.setHovering(true);
    };

    handleMouseLeave = () => this.store.setHovering(false);

    handleFocusCapture = () => {
        if (this.componentProps.pause !== false) this.store.setHovering(true);
    };

    handleBlurCapture = ({ currentTarget, relatedTarget }: React.FocusEvent<HTMLDivElement>) => {
        if (relatedTarget instanceof Node && currentTarget.contains(relatedTarget)) return;

        this.store.setHovering(false);
    };

    handleScroll = () => {
        const track = this.track.current;
        if (!track || this.scroller.looping) return;

        const slides = [...track.children] as HTMLElement[];
        const index = slides.reduce(
            (closest, slide, candidate) =>
                Math.abs(slide.offsetLeft - track.scrollLeft) <
                Math.abs(slides[closest]?.offsetLeft - track.scrollLeft)
                    ? candidate
                    : closest,
            0
        );
        if (index !== this.store.activeIndex) this.store.setIndex(index, true, undefined, true);
    };

    handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        this.componentProps.onKeyDown?.(event);
        if (event.defaultPrevented || this.scroller.looping) return;
        if (
            this.componentProps.keyboard === false ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey
        )
            return;
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
        this.componentProps.onClick?.(event);
        if (event.defaultPrevented || this.scroller.looping) return;

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

    scrollToActive = (index: number, from: number, direction?: -1 | 1) => {
        const track = this.track.current;
        const root = this.root.current;
        if (!track || !root) return;

        this.scroller.dispose();
        const slides = [...track.children] as HTMLElement[];
        const destination = slides[index];
        if (!destination) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const styles = getComputedStyle(root);
        const items = Number.parseFloat(styles.getPropertyValue('--bs-carousel-items')) || 1;
        const peek = Number.parseFloat(styles.getPropertyValue('--bs-carousel-items-peek')) || 0;
        const variableWidth = slides.some(slide => slide.style.width || slide.style.flexBasis);
        const crossingEnd =
            (direction === 1 && index === 0 && from === slides.length - 1) ||
            (direction === -1 && from === 0 && index === slides.length - 1);
        const canLoop =
            (this.componentProps.ends ?? 'loop') === 'loop' &&
            !this.componentProps.fade &&
            !reducedMotion &&
            items === 1 &&
            peek === 0 &&
            !this.componentProps.center &&
            !variableWidth;

        if (crossingEnd && canLoop)
            this.scroller.loop(track, slides[from], destination, direction === 1);
        else this.scroller.navigate(track, destination.offsetLeft, !crossingEnd && !reducedMotion);
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

    renderControls = () => {
        const { controls = true, ends = 'loop' } = this.componentProps;
        if (!controls) return null;

        const atStart = this.store.activeIndex === 0;
        const atEnd = this.store.activeIndex === this.getSlides().length - 1;
        const buttonClass =
            this.componentProps.controlsPlacement === 'overlay'
                ? 'carousel-control-prev'
                : 'btn btn-subtle theme-secondary';

        return (
            <>
                <button
                    type="button"
                    className={buttonClass}
                    data-carousel-action="previous"
                    aria-label="Previous"
                    disabled={ends === 'stop' && atStart}
                >
                    <Icon name="chevron-left" aria-hidden="true" />
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    type="button"
                    className={
                        this.componentProps.controlsPlacement === 'overlay'
                            ? 'carousel-control-next'
                            : 'btn btn-subtle theme-secondary'
                    }
                    data-carousel-action="next"
                    aria-label="Next"
                    disabled={ends === 'stop' && atEnd}
                >
                    <Icon name="chevron-right" aria-hidden="true" />
                    <span className="visually-hidden">Next</span>
                </button>
            </>
        );
    };

    renderIndicators = () =>
        this.componentProps.indicators && this.getSlides().length > 1 ? (
            <div className="carousel-indicators">
                {this.getSlides().map((_, index) => (
                    <button
                        key={index}
                        type="button"
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
        (this.componentProps.playPause || this.componentProps.autoplay) && (
            <button
                type="button"
                className="btn-icon btn-sm carousel-control-play-pause"
                data-carousel-action="toggle"
                aria-label={this.store.playing ? 'Pause' : 'Play'}
            >
                <Icon name={this.store.playing ? 'pause-fill' : 'play-fill'} aria-hidden="true" />
            </button>
        );

    render() {
        const Root: ElementType = this.componentProps.as ?? 'div';

        const slides = this.getSlides();
        const {
            as: _as,
            autoplay: _autoplay,
            center,
            children: _children,
            className,
            controls: _controls,
            controlsPlacement = 'overlay',
            dark,
            ends: _ends,
            fade: _fade,
            fade,
            indicators: _indicators,
            interval: _interval,
            items,
            itemsGap,
            itemsPeek,
            keyboard: _keyboard,
            onChange: _onChange,
            onClick: _onClick,
            pause: _pause,
            playPause: _playPause,
            style,
            ...props
        } = this.componentProps;
        const placement = controlsPlacement === 'overlay';
        const styleWithItems = {
            ...style,
            ...(items && { '--bs-carousel-items': items }),
            ...(itemsGap !== undefined && { '--bs-carousel-items-gap': itemsGap }),
            ...(itemsPeek !== undefined && { '--bs-carousel-items-peek': itemsPeek })
        } as CSSProperties;
        const outerControls = (
            <div className="d-flex justify-content-between align-items-center gap-2">
                {this.renderIndicators()}
                <div className="d-flex align-items-center gap-2">
                    {this.renderPlayPause()}
                    {this.renderControls()}
                </div>
            </div>
        );

        return (
            <Root
                {...props}
                ref={this.root}
                className={classNames(
                    'carousel',
                    { 'carousel-fade': fade, 'carousel-dark': dark, 'carousel-center': center },
                    className
                )}
                style={styleWithItems}
                role="region"
                aria-label={this.componentProps['aria-label'] ?? 'Carousel'}
                aria-roledescription="carousel"
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onFocusCapture={this.handleFocusCapture}
                onBlurCapture={this.handleBlurCapture}
            >
                {controlsPlacement === 'top' && outerControls}
                <div
                    ref={this.track}
                    className="carousel-inner"
                    tabIndex={0}
                    aria-label={this.componentProps['aria-label'] ?? 'Carousel slides'}
                    onScroll={this.handleScroll}
                >
                    {slides.map(this.renderSlide)}
                </div>
                {placement && this.renderControls()}
                {controlsPlacement === 'bottom' && outerControls}
                {placement &&
                    (this.componentProps.playPause || this.componentProps.autoplay) &&
                    this.renderPlayPause()}
                {placement && this.renderIndicators()}
            </Root>
        );
    }
}
