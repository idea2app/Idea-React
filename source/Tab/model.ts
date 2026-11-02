import { action, observable } from 'mobx';

export class TabModel {
    @observable accessor activeKey: string;

    constructor(activeKey: string) {
        this.activeKey = activeKey;
    }

    @action
    select = (key: string) => {
        this.activeKey = key;
    };
}
