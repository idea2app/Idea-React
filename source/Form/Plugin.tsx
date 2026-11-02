'use client';

import { Component, createRef } from 'react';

interface Disposable {
    dispose(): void;
}

export abstract class FormPlugin<
    P,
    I extends Disposable,
    E extends HTMLElement = HTMLDivElement
> extends Component<P> {
    protected element = createRef<E>();
    protected instance?: I;
    private revision = 0;

    protected abstract load(): Promise<(element: E) => I>;
    protected abstract configurationChanged(previous: P): boolean;

    protected updatePlugin() {}

    componentDidMount() {
        this.initialize();
    }

    componentDidUpdate(previous: P) {
        if (this.configurationChanged(previous)) {
            this.dispose();
            this.initialize();
        } else this.updatePlugin();
    }

    componentWillUnmount() {
        this.dispose();
    }

    private initialize = async () => {
        const revision = ++this.revision;
        const create = await this.load();

        if (revision !== this.revision || !this.element.current) return;

        this.instance = create(this.element.current);
        this.updatePlugin();
    };

    protected dispose() {
        this.revision++;
        this.instance?.dispose();
        this.instance = undefined;
    }
}
