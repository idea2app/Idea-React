import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Navbar, NavbarProps } from 'react-bootstrap';

export interface ScrollNavProps extends NavbarProps {
    /**
     * Scroll distance (in pixels) that triggers the navbar to hide when scrolling down.
     * The navbar is always visible while `scrollY` is within this threshold.
     * @default 0
     */
    threshold?: number;
    /**
     * Minimum scroll distance (in pixels) required to trigger a visibility change.
     * Helps prevent flickering caused by small jitter movements.
     * @default 5
     */
    scrollDelta?: number;
}

/**
 * A sticky navigation bar that automatically hides when scrolling down
 * and reappears when scrolling up.
 */
@observer
export class ScrollNav extends Component<ScrollNavProps> {
    static displayName = 'ScrollNav';

    @observable
    accessor lastScrollY = 0;

    @observable
    accessor visible = true;

    handleScroll = () => {
        const { scrollY } = window;
        const { threshold = 0, scrollDelta = 5 } = this.props;
        const delta = scrollY - this.lastScrollY;

        if (Math.abs(delta) < scrollDelta) return;

        this.visible = scrollY <= threshold || delta < 0;
        this.lastScrollY = scrollY;
    };

    componentDidMount() {
        if (!globalThis.window) return;

        this.lastScrollY = window.scrollY;
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        globalThis.window?.removeEventListener?.('scroll', this.handleScroll);
    }

    render() {
        const { visible } = this;
        const { style, children, ...props } = this.props;

        return (
            <Navbar
                {...props}
                sticky="top"
                style={{
                    ...style,
                    transition: 'transform 0.3s',
                    transform: visible ? 'translateY(0)' : 'translateY(-100%)'
                }}
            >
                {children}
            </Navbar>
        );
    }
}
