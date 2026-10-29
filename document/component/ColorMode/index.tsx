'use client';

import { observer } from 'mobx-react';
import { Component, MouseEvent } from 'react';

import { Icon } from '../../../source/Icon';
import { MenuItem } from '../../../source/Menu';
import { DropdownMenu } from '../DropdownMenu';
import { ColorMode, ColorModeModel } from './Model';

const modes: ColorMode[] = ['light', 'dark', 'auto'];
const icons = { light: 'sun', dark: 'moon', auto: 'circle-half' } as const;

@observer
export class ColorModeToggle extends Component {
    model = new ColorModeModel();
    media?: MediaQueryList;

    componentDidMount() {
        this.model.initialize();
        this.media = matchMedia('(prefers-color-scheme: dark)');
        this.media.addEventListener('change', this.handleSystemChange);
    }

    componentWillUnmount() {
        this.media?.removeEventListener('change', this.handleSystemChange);
    }

    handleSystemChange = () => {
        this.model.apply();
    };

    handleSelect = ({
        currentTarget: {
            dataset: { mode }
        }
    }: MouseEvent<HTMLButtonElement>) => {
        if (mode === 'light' || mode === 'dark' || mode === 'auto') this.model.select(mode);
    };

    render() {
        const { mode, error } = this.model;

        return (
            <DropdownMenu
                label={
                    <>
                        <Icon name={icons[mode]} aria-hidden="true" />
                        <span className="visually-hidden">Toggle theme ({mode})</span>
                    </>
                }
            >
                {modes.map(value => (
                    <MenuItem
                        key={value}
                        type="button"
                        data-mode={value}
                        aria-pressed={mode === value}
                        onClick={this.handleSelect}
                    >
                        <Icon name={icons[value]} aria-hidden="true" />
                        {value[0].toUpperCase() + value.slice(1)}
                        {mode === value && <Icon name="check2" aria-hidden="true" />}
                    </MenuItem>
                ))}
                {error && <p role="alert">{error}</p>}
            </DropdownMenu>
        );
    }
}
