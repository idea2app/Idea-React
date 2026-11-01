import { action, autorun, computed, observable } from 'mobx';
import { persist, restore } from 'mobx-restful';
import { setCookie } from 'web-utility';

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
    finishRestore = () => {
        if (this.disposed) return;
        this.systemDark = this.media.matches;
        this.media.addEventListener('change', this.handleSystemChange);
        this.ready = true;
    };

    restored = restore(this, 'ColorMode').then(this.finishRestore);

    disposer = autorun(() => {
        document.documentElement.dataset.bsTheme = this.resolvedColorScheme;
        setCookie('colorScheme', this.resolvedColorScheme);
    });

    dispose = () => {
        this.disposed = true;
        this.disposer();
        this.media.removeEventListener('change', this.handleSystemChange);
    };

    handleSystemChange = action(({ matches }: MediaQueryListEvent) => (this.systemDark = matches));

    setColorScheme = action((colorScheme: ColorScheme) => (this.colorScheme = colorScheme));
}
