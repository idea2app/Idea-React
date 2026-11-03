'use client';

import { EditorCore, WrapperProps } from '@react-editor-js/core';
import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    Component,
    ElementType,
    FocusEvent,
    HTMLAttributes,
    InputHTMLAttributes,
    PropsWithoutRef
} from 'react';
import { createReactEditorJS } from 'react-editor-js';

import { AsProps, PolymorphicClassProps } from '../Polymorphic';

const ReactEditorJS = createReactEditorJS();

export type EditorProps = PropsWithoutRef<
    WrapperProps &
        Pick<InputHTMLAttributes<HTMLInputElement>, 'name' | 'required'> &
        Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'tabIndex' | 'onBlur'>
>;

@observer
export class Editor<T extends ElementType | undefined = 'div'> extends Component<
    PolymorphicClassProps<T, EditorProps>
> {
    declare readonly props: PolymorphicClassProps<T, EditorProps>;

    protected get componentProps(): Readonly<EditorProps & AsProps> {
        return this.props;
    }

    static displayName = 'Editor';

    private core?: EditorCore;

    @observable
    accessor innerValue = this.componentProps.defaultValue;

    save = async () => this.core && (this.innerValue = await this.core.save());

    handleBlur = (event: FocusEvent<HTMLDivElement>) => {
        this.componentProps.onBlur?.(event);

        return this.save();
    };

    initialize = (core: EditorCore) => {
        this.componentProps.onInitialize?.(core);

        this.core = core;
    };

    render() {
        const Root: ElementType = this.componentProps.as ?? 'div';

        const {
                as: _as,
                name,
                required,
                className,
                style,
                tabIndex = -1,
                onBlur: _onBlur,
                children: _children,
                ...editorProps
            } = this.componentProps,
            { innerValue } = this;

        return (
            <Root
                {...(this.componentProps.as ? editorProps : {})}
                className={classNames('form-control', className)}
                style={style}
                tabIndex={tabIndex}
                onBlur={this.handleBlur}
            >
                <input hidden {...{ name, required }} value={JSON.stringify(innerValue)} />
                <ReactEditorJS {...editorProps} onInitialize={this.initialize} />
            </Root>
        );
    }
}
