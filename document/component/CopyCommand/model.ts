import { action, observable } from 'mobx';

export class ClipboardModel {
    @observable accessor status: 'idle' | 'copying' | 'copied' = 'idle';

    @action
    copied() {
        this.status = 'copied';
    }

    @action
    finishCopy() {
        if (this.status === 'copying') this.status = 'idle';
    }

    @action
    async copy(text: string) {
        this.status = 'copying';

        try {
            await navigator.clipboard.writeText(text);
            this.copied();
        } finally {
            this.finishCopy();
        }
    }
}
