import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, HTMLAttributes, RefCallback } from 'react';
import { sleep } from 'web-utility';

export interface TypeEchoProps extends HTMLAttributes<HTMLPreElement> {
    text: string;
    intervals?: number;
}

@observer
export class TypeEcho extends Component<TypeEchoProps> {
    static displayName = 'TypeEcho';

    @observable
    accessor echoed = '';

    init: RefCallback<HTMLPreElement> = node =>
        node &&
        new IntersectionObserver(async ([{ isIntersecting }], observer) => {
            if (!isIntersecting) return;

            observer.disconnect();

            const { text, intervals = 150 } = this.props;

            for (const char of text) {
                await sleep(intervals / 1000);

                this.echoed += char;
            }
        }).observe(node);

    render() {
        const { className, text, ...props } = this.props,
            { echoed } = this;

        return (
            <pre
                {...props}
                ref={this.init}
                className={classNames('text-wrap', className)}
            >
                {echoed + (echoed === text ? '' : '_')}
            </pre>
        );
    }
}
