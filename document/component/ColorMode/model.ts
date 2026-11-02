import { action, autorun, computed, observable } from 'mobx';
import { persist, restore } from 'mobx-restful';
import { sleep } from 'web-utility';

export type ColorScheme = 'light' | 'dark' | 'auto';

export class ColorModeModel {
    media = window.matchMedia('(prefers-color-scheme: dark)');

    @observable
    accessor systemDark = false;

    @persist()
    @observable
    accessor colorScheme: ColorScheme = 'auto';

    @computed
    get resolvedColorScheme() {
        return this.colorScheme === 'auto'
            ? this.systemDark
                ? 'dark'
                : 'light'
            : this.colorScheme;
    }

    @observable
    accessor ready = false;

    disposed = false;

    @action
    finishRestore = async () => {
        if (this.disposed) return;

        this.systemDark = this.media.matches;
        this.media.addEventListener('change', this.handleSystemChange);
        document.documentElement.dataset.bsTheme = this.resolvedColorScheme;

        await sleep(0.25);

        this.markReady();
    };

    @action
    markReady = () => {
        if (!this.disposed) this.ready = true;
    };

    restored = restore(this, 'ColorMode').then(this.finishRestore);

    disposer = autorun(() => {
        if (!this.ready) return;

        document.documentElement.dataset.bsTheme = this.resolvedColorScheme;
    });

    dispose = () => {
        this.disposed = true;
        this.disposer();
        this.media.removeEventListener('change', this.handleSystemChange);
    };

    handleSystemChange = action(({ matches }: MediaQueryListEvent) => (this.systemDark = matches));

    setColorScheme = action((colorScheme: ColorScheme) => (this.colorScheme = colorScheme));
}
