'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, PropsWithChildren } from 'react';

export type MermaidProps = PropsWithChildren;

@observer
export class Mermaid extends Component<MermaidProps> {
    static displayName = 'Mermaid';

    @observable
    accessor svg = '';

    private mounted = false;
    private revision = 0;

    private get source() {
        const { children } = this.props;

        if (typeof children !== 'string') throw new TypeError('Mermaid source must be a string.');

        return children;
    }

    componentDidMount() {
        this.mounted = true;
        void this.renderDiagram();
    }

    componentDidUpdate({ children }: MermaidProps) {
        if (children !== this.props.children) void this.renderDiagram();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.revision++;
    }

    @action
    setSvg = (svg: string) => (this.svg = svg);

    async renderDiagram() {
        const revision = ++this.revision;
        const { source } = this;
        const { default: mermaid } = await import('mermaid');

        if (!this.mounted || revision !== this.revision) return;

        mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            suppressErrorRendering: true,
            theme: 'neutral',
            flowchart: { useMaxWidth: false }
        });
        const { svg } = await mermaid.render(`mermaid-${crypto.randomUUID()}`, source);

        if (this.mounted && revision === this.revision) this.setSvg(svg);
    }

    render() {
        return this.svg ? (
            <div
                dangerouslySetInnerHTML={{ __html: this.svg }}
                className="my-6 overflow-x-auto rounded-3 bg-white p-3"
            />
        ) : (
            <pre className="my-6 overflow-x-auto">{this.source}</pre>
        );
    }
}
