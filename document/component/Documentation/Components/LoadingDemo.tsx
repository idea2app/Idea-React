'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { sleep } from 'web-utility';

import { Button } from '../../../../source/Button';
import { Loading } from '../../../../source/Loading';

@observer
export class LoadingDemo extends Component {
    @observable
    accessor loading = false;

    @action
    show = () => (this.loading = true);

    @action
    hide = () => (this.loading = false);

    handleClick = async () => {
        this.show();

        await sleep(1);

        this.hide();
    };

    render() {
        const { loading } = this;

        return (
            <>
                <Button
                    variant="solid"
                    theme="primary"
                    style={{ zIndex: 1040 }}
                    onClick={this.handleClick}
                >
                    Show loading
                </Button>
                {loading && <Loading>Loading...</Loading>}
            </>
        );
    }
}
