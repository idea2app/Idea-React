import { action, autorun, observable } from 'mobx';
import { persist, restore } from 'mobx-restful';
import { setCookie } from 'web-utility';

export type ColorScheme = 'light' | 'dark';

const matchColorScheme = (color: ColorScheme) =>
    globalThis.matchMedia?.(`(prefers-color-scheme: ${color})`);

export class ColorModeModel {
    @persist()
    @observable
    accessor colorScheme: ColorScheme = 'light';

    @observable accessor ready = false;

    @action
    finishRestore = () => (this.ready = true);

    @action
    initialize() {
        this.colorScheme = matchColorScheme('dark')?.matches ? 'dark' : 'light';
        void restore(this, 'System').then(this.finishRestore);
        const media = matchColorScheme('dark');
        media?.addEventListener('change', this.handleSystemChange);
        const disposer = autorun(() => {
            document.documentElement.dataset.bsTheme = this.colorScheme;
            setCookie('colorScheme', this.colorScheme);
        });
        return () => {
            disposer();
            media?.removeEventListener('change', this.handleSystemChange);
        };
    }

    @action
    handleSystemChange = ({ matches }: MediaQueryListEvent) =>
        (this.colorScheme = matches ? 'dark' : 'light');

    @action
    toggleColorScheme = () => (this.colorScheme = this.colorScheme === 'dark' ? 'light' : 'dark');
}
