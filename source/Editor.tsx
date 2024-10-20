import { EditorCore, WrapperProps } from '@react-editor-js/core';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, InputHTMLAttributes, PropsWithoutRef } from 'react';
import { createReactEditorJS } from 'react-editor-js';

const ReactEditorJS = createReactEditorJS();

export type EditorProps = PropsWithoutRef<
    WrapperProps &
        Pick<InputHTMLAttributes<HTMLInputElement>, 'name' | 'required'>
>;

@observer
export class Editor extends Component<EditorProps> {
    static displayName = 'Editor';

    private core?: EditorCore;

    @observable
    accessor innerValue = this.props.defaultValue;

    save = async () => this.core && (this.innerValue = await this.core.save());

    render() {
        const { name, required, children, ...editorProps } = this.props,
            { innerValue } = this;

        return (
            <div className="form-control" tabIndex={-1} onBlur={this.save}>
                <input
                    hidden
                    {...{ name, required }}
                    value={JSON.stringify(innerValue)}
                />
                <ReactEditorJS
                    {...editorProps}
                    onInitialize={core => {
                        this.core = core;
                        editorProps.onInitialize?.(core);
                    }}
                />
            </div>
        );
    }
}
