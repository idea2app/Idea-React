import { action, observable } from 'mobx';

export type ColorMode = 'light' | 'dark' | 'auto';

export class ColorModeModel {
    @observable accessor mode: ColorMode = 'auto';

    @observable accessor error = '';

    @action
    initialize() {
        try {
            const saved = localStorage.getItem('idea-react-color-mode');
            if (saved === 'light' || saved === 'dark' || saved === 'auto') this.mode = saved;
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Unable to read your color mode.';
        }
        this.apply();
    }

    apply = () => {
        const dark =
            this.mode === 'dark' ||
            (this.mode === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.dataset.bsTheme = dark ? 'dark' : 'light';
    };

    @action
    select(mode: ColorMode) {
        this.mode = mode;
        this.error = '';
        this.apply();
        try {
            localStorage.setItem('idea-react-color-mode', mode);
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Unable to save your color mode.';
        }
    }
}
