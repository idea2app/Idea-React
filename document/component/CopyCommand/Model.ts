import { action, observable } from 'mobx';

export class ClipboardModel {
    @observable accessor status: 'idle' | 'copying' | 'copied' | 'error' = 'idle';

    @observable accessor error = '';

    @action
    copied() {
        this.status = 'copied';
    }

    @action
    failed(error: unknown) {
        this.status = 'error';
        this.error = error instanceof Error ? error.message : 'Unable to copy the command.';
    }

    @action
    async copy(text: string) {
        this.status = 'copying';
        this.error = '';

        try {
            if (!globalThis.navigator?.clipboard) {
                throw new Error('Clipboard access requires HTTPS or localhost.');
            }
            await navigator.clipboard.writeText(text);
            this.copied();
        } catch (error) {
            this.failed(error);
        }
    }
}
