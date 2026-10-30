'use client';

import { observer } from 'mobx-react';
import { Component } from 'react';

import { Button } from '../../../source/Button';
import { Icon } from '../../../source/Icon';
import { ColorModeModel } from './model';

@observer
export class ColorModeToggle extends Component {
    model = new ColorModeModel();
    disposer?: () => void;

    componentDidMount() {
        this.disposer = this.model.initialize();
    }

    componentWillUnmount() {
        this.disposer?.();
    }

    render() {
        const { colorScheme, ready, toggleColorScheme } = this.model;

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
