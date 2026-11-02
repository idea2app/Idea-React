import { action, observable } from 'mobx';

export class NavOverflowModel {
    @observable accessor open = false;

    @observable accessor overflowIndices: number[] = [];

    @action
    setOpen = (open: boolean) => {
        this.open = open;
    };

    @action
    toggle = () => {
        this.open = !this.open;
    };

    @action
    setOverflowIndices = (indices: number[]) => {
        this.overflowIndices = indices;
    };
}
