import React, { PropsWithoutRef, ComponentClass, PureComponent } from 'react';
import EditorJS from '@editorjs/editorjs';
import { createReactEditorJS } from 'react-editor-js';

const ReactEditorJS = createReactEditorJS();

export type EditorProps = PropsWithoutRef<{
    tools: Record<string, ComponentClass>;
    name: string;
    defaultValue: string;
}>;

interface State {
    value: string;
}

export class Editor extends PureComponent<EditorProps, State> {
    static displayName = 'Editor';

    private core?: EditorJS;

    state: Readonly<State> = { value: '' };

    static getDerivedStateFromProps(
        { defaultValue }: EditorProps,
        { value }: State
    ): State {
        return { value: defaultValue && !value ? defaultValue : value };
    }

    save = async () => {
        if (!this.core) return;

        const data = await this.core.save();

        this.setState({ value: JSON.stringify(data) });
    };

    render() {
        const { tools, name, defaultValue } = this.props,
            { value } = this.state;

        return (
            <div className="form-control" tabIndex={-1} onBlur={this.save}>
                <input type="hidden" name={name} value={value} />

                <ReactEditorJS
                    tools={tools}
                    defaultValue={JSON.parse(defaultValue)}
                    onInitialize={(core: EditorJS) => (this.core = core)}
                />
            </div>
        );
    }
}
