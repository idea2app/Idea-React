'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, ElementType, HTMLAttributes, Ref, RefCallback } from 'react';
import { sleep } from 'web-utility';

import { AsProps, PolymorphicClassProps } from '../../Polymorphic';

export interface TypeEchoContentProps extends Omit<HTMLAttributes<HTMLPreElement>, 'children'> {
    text: string;
    intervals?: number;
    rootRef?: Ref<HTMLElement>;
}

@observer
export class TypeEchoContent<T extends ElementType | undefined = 'pre'> extends Component<
    PolymorphicClassProps<T, TypeEchoContentProps>
> {
    static displayName = 'TypeEchoContent';

    declare readonly props: PolymorphicClassProps<T, TypeEchoContentProps>;

    protected get componentProps(): Readonly<TypeEchoContentProps & AsProps> {
        return this.props;
    }

    @observable
    accessor echoed = '';

    @observable
    accessor started = false;

    visibilityObserver?: IntersectionObserver;

    private root?: HTMLElement | null;
    private forwardedRootRef?: Ref<HTMLElement>;
    private releaseRootRef?: () => unknown;

    componentDidMount() {
        this.start();
    }

    start = action(() => (this.started = true));

    echo = action((char: string) => (this.echoed += char));

    componentWillUnmount() {
        this.visibilityObserver?.disconnect();
    }

    componentDidUpdate() {
        this.forwardRootRef(this.root ?? null);
    }

    forwardRootRef = (node: HTMLElement | null) => {
        const { rootRef } = this.componentProps;

        if (this.root === node && this.forwardedRootRef === rootRef) return;

        this.releaseRootRef?.();
        this.releaseRootRef = undefined;
        this.root = node;
        this.forwardedRootRef = rootRef;

        if (!node) return;

        if (typeof rootRef === 'function') {
            const cleanup = rootRef(node);

            this.releaseRootRef = typeof cleanup === 'function' ? cleanup : () => rootRef(null);
        } else if (rootRef) {
            rootRef.current = node;
            this.releaseRootRef = () => (rootRef.current = null);
        }
    };

    init: RefCallback<HTMLElement> = node => {
        this.visibilityObserver?.disconnect();

        this.forwardRootRef(node);

        if (!node) return;

        this.visibilityObserver = new IntersectionObserver(
            async ([{ isIntersecting }], observer) => {
                if (!isIntersecting) return;

                observer.disconnect();

                const { text, intervals = 150 } = this.componentProps;

                for (const char of text) {
                    await sleep(intervals / 1000);

                    this.echo(char);
                }
            }
        );
        this.visibilityObserver.observe(node);
    };

    render() {
        const Root: ElementType = this.componentProps.as ?? 'pre';

        const {
            as: _as,
            rootRef: _rootRef,
            className,
            text,
            intervals: _intervals,
            ...props
        } = this.componentProps;
        const { started, echoed } = this;

        return (
            <Root {...props} ref={this.init} className={classNames('text-wrap', className)}>
                {started ? echoed + (echoed === text ? '' : '_') : text}
            </Root>
        );
    }
}
