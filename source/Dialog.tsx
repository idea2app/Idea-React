import { Defer } from 'iterable-observer';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FC } from 'react';

export class DialogClose extends Error {
    constructor(message = 'Dialog closed') {
        super(message);
    }
}

export interface DialogProps<T = any> {
    defer?: Defer<T>;
}

export class Dialog<I extends object = {}, O = any> {
    @observable
    accessor input = {} as I;

    @observable
    accessor defer: Defer<O> | undefined;

    Component: FC<I>;

    constructor(Factory: FC<I & DialogProps<O>>) {
        this.Component = observer(props => (
            <Factory {...props} {...this.input} defer={this.defer} />
        ));
        this.Component.displayName = 'DialogComponent';
    }

    open(input?: I) {
        if (input) this.input = input;

        this.defer = new Defer();

        this.defer.promise.finally(() => (this.defer = undefined));

        return this.defer.promise;
    }
}
