import classNames from 'classnames';
import { PropsWithoutRef, PureComponent, RefCallback } from 'react';
import { sleep } from 'web-utility';

export type TypeEchoProps = PropsWithoutRef<{
    className?: string;
    text: string;
    intervals?: number;
}>;
type State = { echoed: string };

export class TypeEcho extends PureComponent<TypeEchoProps, State> {
    static displayName = 'TypeEcho';

    state: Readonly<State> = { echoed: '' };

    init: RefCallback<HTMLPreElement> = node =>
        node &&
        new IntersectionObserver(async ([{ isIntersecting }], observer) => {
            if (!isIntersecting) return;

            observer.disconnect();

            const { text, intervals = 150 } = this.props;

            for (const char of text) {
                await sleep(intervals / 1000);

                this.setState({ echoed: this.state.echoed + char });
            }
        }).observe(node);

    render() {
        const { className, text } = this.props,
            { echoed } = this.state;

        return (
            <pre className={classNames('text-wrap', className)} ref={this.init}>
                {echoed + (echoed === text ? '' : '_')}
            </pre>
        );
    }
}
