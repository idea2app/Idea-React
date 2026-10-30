'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';

import { Button } from '../../../source/Button';
import { Icon } from '../../../source/Icon';
import { ColorModeModel } from './model';

@observer
export class ColorModeToggle extends Component {
    @observable accessor model: ColorModeModel | undefined;

    @action
    componentDidMount() {
        this.model = new ColorModeModel();
    }

    componentWillUnmount() {
        this.model?.dispose();
    }

    render() {
        const { colorScheme = 'light', ready, toggleColorScheme } = this.model || {};

        return (
            <Button
                type="button"
                variant="text"
                aria-label={`Toggle theme (${colorScheme})`}
                disabled={!ready}
                onClick={toggleColorScheme}
            >
                <Icon name={colorScheme === 'dark' ? 'moon' : 'sun'} aria-hidden="true" />
            </Button>
        );
    }
}
