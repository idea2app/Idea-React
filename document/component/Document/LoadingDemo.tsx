'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { sleep } from 'web-utility';

import { Button } from '../../../source/Base/Button';
import { Loading } from '../../../source/Extension/Loading';

@observer
export class LoadingDemo extends Component {
    @observable
    accessor loading = false;

    show = action(() => (this.loading = true));

    hide = action(() => (this.loading = false));

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
