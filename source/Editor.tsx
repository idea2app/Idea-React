import { EditorCore, WrapperProps } from '@react-editor-js/core';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InputHTMLAttributes, PropsWithoutRef, PureComponent } from 'react';
import { createReactEditorJS } from 'react-editor-js';

const ReactEditorJS = createReactEditorJS();

export type EditorProps = PropsWithoutRef<
    WrapperProps &
        Pick<InputHTMLAttributes<HTMLInputElement>, 'name' | 'required'>
>;

@observer
export class Editor extends PureComponent<EditorProps> {
    static displayName = 'Editor';

    private core?: EditorCore;

    @observable
    innerValue = this.props.defaultValue;

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
                    onInitialize={core =>
                        editorProps.onInitialize((this.core = core))
                    }
                />
            </div>
        );
    }
}
