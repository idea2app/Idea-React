'use client';

import { observer } from 'mobx-react';
import { Component, ContextType, MouseEvent } from 'react';

import { Icon } from '../../../source/Extension/Icon';
import { Menu, MenuItem } from '../../../source/Menu';
import { ColorScheme } from './model';
import { ColorModeContext } from './Provider';

const modes: { value: ColorScheme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'sun-fill' },
    { value: 'dark', label: 'Dark', icon: 'moon-stars-fill' },
    { value: 'auto', label: 'Auto', icon: 'circle-half' }
];

@observer
export class ColorModeToggle extends Component {
    static contextType = ColorModeContext;

    declare context: ContextType<typeof ColorModeContext>;

    handleSelect = ({
        currentTarget: {
            dataset: { colorScheme }
        }
    }: MouseEvent<HTMLButtonElement>) => {
        if (colorScheme === 'light' || colorScheme === 'dark' || colorScheme === 'auto')
            this.context?.setColorScheme(colorScheme);
    };

    renderMode = ({ value, label, icon }: (typeof modes)[number]) => {
        const selected = (this.context?.colorScheme ?? 'auto') === value;

        return (
            <MenuItem
                key={value}
                type="button"
                className={selected ? 'active' : ''}
                data-color-scheme={value}
                aria-pressed={selected}
                onClick={this.handleSelect}
            >
                <Icon name={icon} aria-hidden="true" />
                {label}
                <Icon
                    name="check2"
                    className={selected ? 'ms-auto' : 'ms-auto invisible'}
                    aria-hidden="true"
                />
            </MenuItem>
        );
    };

    render() {
        const { colorScheme = 'auto', ready } = this.context || {};
        const icon = modes.find(({ value }) => value === colorScheme)!.icon;

        return (
            <Menu
                id="documentation-theme"
                toggleProps={{
                    variant: 'link',
                    className: 'nav-link align-items-center justify-content-center px-1 gap-1',
                    'aria-label': `Toggle theme (${colorScheme})`,
                    disabled: !ready
                }}
                label={
                    <>
                        <Icon name={icon} aria-hidden="true" />
                        <span className="visually-hidden">Toggle theme</span>
                        <Icon name="chevron-expand" size={0.75} aria-hidden="true" />
                    </>
                }
            >
                {modes.map(this.renderMode)}
            </Menu>
        );
    }
}
