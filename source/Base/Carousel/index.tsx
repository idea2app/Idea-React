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

import { Icon } from '../../Extension/Icon';
import { polymorphic, PolymorphicClassProps } from '../../Helper/Polymorphic';
import { Button } from '../Button';
import { CarouselEnds, CarouselModel } from './model';
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

    store = new CarouselModel(0, 'loop', () => 5000);

    scroller = new CarouselScroll();

    componentDidMount() {
        this.updateStore();
        if (this.props.autoplay) this.store.play();
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        this.track.current?.addEventListener('scroll', this.handleScroll, { passive: true });
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
        this.store.dispose();
        this.scroller.dispose();

        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        this.track.current?.removeEventListener('scroll', this.handleScroll);
    }

    private getSlides = () => Children.toArray(this.props.children);

    private getSlideInterval = (index: number) => {
        const slide = this.getSlides()[index];
        const itemInterval = isValidElement<CarouselSlideProps>(slide)
            ? slide.props.interval
            : undefined;

        return itemInterval ?? this.props.interval ?? 5000;
    };

    private updateStore = () => {
        const slides = this.getSlides();
        this.store.onChange = this.props.onChange;
        this.store.onNavigate = this.scrollToActive;
        this.store.update(slides.length, this.props.ends ?? 'loop', this.getSlideInterval);
    };

    handleVisibilityChange = () => this.store.setVisible(!document.hidden);

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
        this.props.onKeyDown?.(event);
        if (event.defaultPrevented || this.scroller.looping) return;
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
            (this.props.ends ?? 'loop') === 'loop' &&
            !this.props.fade &&
            !reducedMotion &&
            items === 1 &&
            peek === 0 &&
            !this.props.center &&
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

    renderControl = (direction: 'previous' | 'next') => {
        const { controls = true, ends = 'loop' } = this.props;
        if (!controls) return null;

        const previous = direction === 'previous';
        const atEnd = this.store.activeIndex === (previous ? 0 : this.getSlides().length - 1);
        const overlay = (this.props.controlsPlacement ?? 'overlay') === 'overlay';
        const label = previous ? 'Previous' : 'Next';

        return (
            <Button
                type="button"
                variant={overlay ? 'subtle' : undefined}
                theme={overlay ? 'secondary' : undefined}
                size="sm"
                data-carousel-action={direction}
                aria-label={label}
                disabled={ends === 'stop' && atEnd}
                icon
            >
                <Icon
                    name={previous ? 'chevron-left' : 'chevron-right'}
                    size={1}
                    aria-hidden="true"
                />
                <span className="visually-hidden">{label}</span>
            </Button>
        );
    };

    renderIndicators = () =>
        this.props.indicators && this.getSlides().length > 1 ? (
            <div className="carousel-indicators">
                {this.getSlides().map((_, index) => (
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
                type="button"
                className={classNames('carousel-control-play-pause', {
                    paused: !this.store.playing
                })}
                size="sm"
                data-carousel-action="toggle"
                aria-label={this.store.playing ? 'Pause' : 'Play'}
                icon
            >
                <Icon
                    name={this.store.playing ? 'pause-fill' : 'play-fill'}
                    size={1}
                    aria-hidden="true"
                />
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
                '--bs-carousel-interval': `${this.getSlideInterval(this.store.activeIndex)}ms`
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
            >
                {controlsPlacement === 'top' && this.renderControls()}
                <div
                    ref={this.track}
                    className={classNames('carousel-inner', innerClassName)}
                    tabIndex={0}
                    aria-label={this.props['aria-label'] ?? 'Carousel slides'}
                    onScroll={this.handleScroll}
                >
                    {slides.map(this.renderSlide)}
                </div>
                {controlsPlacement !== 'top' && this.renderControls()}
            </Root>
        );
    }
}
