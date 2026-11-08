'use client';

import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent, reaction } from 'mobx-react-helper';
import { ElementType, HTMLAttributes } from 'react';
import { Second, TimeData } from 'web-utility';

import { AsProps, PolymorphicClassProps } from '../Helper/Polymorphic';

export interface TimeUnit {
    scale: number;
    label: string;
}

interface TimeSection {
    value: number;
    label: string;
}

export interface CountdownProps extends HTMLAttributes<HTMLOListElement> {
    units: TimeUnit[];
    endTime: TimeData;
    itemClassName?: string;
    onEnd?: (endTime: TimeData) => unknown;
}

/**
 * Migrate from https://bootstrap.web-cell.dev/#Calendar/CountDown
 */
@observer
export class Countdown<T extends ElementType | undefined = 'ol'> extends ObservedComponent<
    PolymorphicClassProps<T, CountdownProps>
> {
    declare readonly props: PolymorphicClassProps<T, CountdownProps>;

    protected get componentProps(): CountdownProps & AsProps {
        return this.observedProps;
    }

    static displayName = 'Countdown';

    @observable
    accessor rest = 0;

    private timer = 0;

    get endTimestamp() {
        return +new Date(this.componentProps.endTime || Date.now());
    }

    @computed
    get timeSections(): TimeSection[] {
        const { units } = this.componentProps;
        let { rest } = this;

        return units.reduce((list, { label }, index) => {
            const scale = units
                .slice(index)
                .map(({ scale }) => scale)
                .reduce((sum, scale) => sum * scale, 1);

            const value = ~~(rest / scale);
            rest -= value * scale;

            list.push({ value, label });
            return list;
        }, [] as TimeSection[]);
    }

    tick = () => {
        const { onEnd, endTime } = this.componentProps,
            rest = this.endTimestamp - Date.now();

        if (rest > 0) {
            this.rest = rest;
        } else {
            this.rest = 0;
            this.stop();
            onEnd?.(endTime);
        }
    };

    stop() {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = 0;
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this.initTimer();
    }

    @reaction(_this => _this.componentProps.endTime)
    initTimer() {
        this.stop();
        this.tick();
        this.timer = window.setInterval(this.tick, Second);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.stop();
    }

    render() {
        const {
            as,
            className = '',
            itemClassName = 'border rounded px-4 py-3 d-flex flex-column justify-content-center align-items-center',
            units: _u,
            endTime: _e,
            onEnd: _o,
            ...props
        } = this.componentProps;
        const Root: ElementType = as ?? 'ol';
        const { timeSections } = this;

        return (
            <Root className={`list-unstyled m-0 ${className}`} {...props}>
                {timeSections.map(({ value, label }) => (
                    <li key={label} className={itemClassName}>
                        <strong>{(value + '').padStart(2, '0')}</strong>
                        <span>{label}</span>
                    </li>
                ))}
            </Root>
        );
    }
}
