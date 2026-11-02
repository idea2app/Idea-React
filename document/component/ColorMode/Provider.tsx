'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, createContext, PropsWithChildren } from 'react';

import { Loading } from '../../../source/Extension/Loading';
import { ColorModeModel } from './model';

export const ColorModeContext = createContext<ColorModeModel | undefined>(undefined);

@observer
export class ColorModeProvider extends Component<PropsWithChildren> {
    @observable accessor model: ColorModeModel | undefined;

    @action
    componentDidMount() {
        this.model = new ColorModeModel();
    }

    componentWillUnmount() {
        this.model?.dispose();
    }

    render() {
        const { model } = this;
        const pending = !model?.ready;

        return (
            <ColorModeContext.Provider value={model}>
                {pending && <Loading style={{ zIndex: 2147483647 }} role="status" opaque />}

                <div inert={pending} aria-busy={pending}>
                    {this.props.children}
                </div>
            </ColorModeContext.Provider>
        );
    }
}
