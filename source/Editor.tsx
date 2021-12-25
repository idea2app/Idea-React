import { PropsWithoutRef, PureComponent } from 'react';
import EditorJS from '@editorjs/editorjs';
import { createReactEditorJS } from 'react-editor-js';

import List from '@editorjs/list';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Image from '@editorjs/image';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';

const ReactEditorJS = createReactEditorJS(),
    Tools = {
        list: List,
        code: Code,
        linkTool: LinkTool,
        image: Image,
        header: Header,
        quote: Quote
    };

export type EditorProps = PropsWithoutRef<{
    name: string;
    defaultValue: string;
}>;

interface State {
    value: string;
}

export default class Editor extends PureComponent<EditorProps, State> {
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
        const { name, defaultValue } = this.props,
            { value } = this.state;

        return (
            <div className="form-control" tabIndex={-1} onBlur={this.save}>
                <input type="hidden" name={name} value={value} />

                <ReactEditorJS
                    tools={Tools}
                    defaultValue={JSON.parse(defaultValue)}
                    onInitialize={(core: EditorJS) => (this.core = core)}
                />
            </div>
        );
    }
}
