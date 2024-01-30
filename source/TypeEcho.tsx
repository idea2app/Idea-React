import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PropsWithoutRef, PureComponent, RefCallback } from 'react';
import { sleep } from 'web-utility';

export type TypeEchoProps = PropsWithoutRef<{
    className?: string;
    text: string;
    intervals?: number;
}>;

@observer
export class TypeEcho extends PureComponent<TypeEchoProps> {
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
        const { className, text } = this.props,
            { echoed } = this;

        return (
            <pre className={classNames('text-wrap', className)} ref={this.init}>
                {echoed + (echoed === text ? '' : '_')}
            </pre>
        );
    }
}
