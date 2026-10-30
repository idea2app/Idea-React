import { action, autorun, observable } from 'mobx';
import { persist, restore } from 'mobx-restful';
import { setCookie } from 'web-utility';

export type ColorScheme = 'light' | 'dark';

const matchColorScheme = (color: ColorScheme) =>
    globalThis.matchMedia?.(`(prefers-color-scheme: ${color})`);

export class ColorModeModel {
    media = matchColorScheme('dark');

    @persist()
    @observable
    accessor colorScheme: ColorScheme = this.media?.matches ? 'dark' : 'light';

    @observable accessor ready = false;

    disposed = false;

    @action
    finishRestore = () => {
        if (this.disposed) return;
        this.media?.addEventListener('change', this.handleSystemChange);
        this.ready = true;
    };

    restored = restore(this, 'ColorMode').then(this.finishRestore);

    disposer = autorun(() => {
        document.documentElement.dataset.bsTheme = this.colorScheme;
        setCookie('colorScheme', this.colorScheme);
    });

    dispose = () => {
        this.disposed = true;
        this.disposer();
        this.media?.removeEventListener('change', this.handleSystemChange);
    };

    @action
    handleSystemChange = ({ matches }: MediaQueryListEvent) =>
        (this.colorScheme = matches ? 'dark' : 'light');

    @action
    toggleColorScheme = () => (this.colorScheme = this.colorScheme === 'dark' ? 'light' : 'dark');
}
