'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, HTMLAttributes, RefCallback } from 'react';
import { sleep } from 'web-utility';

export interface TypeEchoContentProps extends Omit<HTMLAttributes<HTMLPreElement>, 'children'> {
    text: string;
    intervals?: number;
}

@observer
export class TypeEchoContent extends Component<TypeEchoContentProps> {
    @observable
    accessor echoed = '';

    @observable
    accessor started = false;

    componentDidMount() {
        this.start();
    }

    @action
    start = () => {
        this.started = true;
    };

    @action
    echo = (char: string) => {
        this.echoed += char;
    };

    init: RefCallback<HTMLPreElement> = node =>
        node &&
        new IntersectionObserver(async ([{ isIntersecting }], observer) => {
            if (!isIntersecting) return;

            observer.disconnect();

            const { text, intervals = 150 } = this.props;

            for (const char of text) {
                await sleep(intervals / 1000);

                this.echo(char);
            }
        }).observe(node);

    render() {
        const { className, text, intervals: _intervals, ...props } = this.props;
        const { started, echoed } = this;

        return (
            <pre {...props} ref={this.init} className={classNames('text-wrap', className)}>
                {started ? echoed + (echoed === text ? '' : '_') : text}
            </pre>
        );
    }
}
