'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';

import { Icon } from '../../../../source/Icon';
import { Option, Select } from '../../../../source/Select';

@observer
export class SelectDemo extends Component {
    @observable
    accessor value = '0';

    @action
    handleChange = (value: string) => (this.value = value);

    render() {
        const { value } = this;

        return (
            <Select aria-label="Organization" value={value} onChange={this.handleChange}>
                <Option value="0">
                    <Icon className="me-2" name="heart" />
                    idea2app
                </Option>
                <Option value="1">
                    <Icon className="me-2" name="bootstrap" />
                    freeCodeCamp
                </Option>
            </Select>
        );
    }
}
