import { Defer } from 'iterable-observer';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FC } from 'react';

export class DialogBoxClose extends Error {
    constructor(message = 'Dialog closed') {
        super(message);
    }
}

export interface DialogBoxProps<T = unknown> {
    defer?: Defer<T>;
}

export class DialogBox<I extends object = {}, O = unknown> {
    @observable
    accessor input = {} as I;

    @observable
    accessor defer: Defer<O> | undefined;

    Component: FC<I>;

    constructor(Factory: FC<I & DialogBoxProps<O>>) {
        this.Component = observer(props => (
            <Factory {...props} {...this.input} defer={this.defer} />
        ));
        this.Component.displayName = 'DialogBoxComponent';
    }

    @action
    open(input?: I) {
        if (input) this.input = input;

        const defer = new Defer<O>();
        this.defer = defer;

        const clear = action(() => this.defer === defer && (this.defer = undefined));

        defer.promise.then(clear, clear);

        return defer.promise;
    }
}
