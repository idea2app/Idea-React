import { action, computed, observable } from 'mobx';

export type DocumentationSearchEntry = Record<'title' | 'href' | 'description', string>;

const isSearchEntry = (entry: unknown): entry is DocumentationSearchEntry =>
    typeof entry === 'object' &&
    entry !== null &&
    'title' in entry &&
    typeof entry.title === 'string' &&
    'href' in entry &&
    typeof entry.href === 'string' &&
    'description' in entry &&
    typeof entry.description === 'string';

export class DocumentationSearchModel {
    @observable accessor query = '';
    @observable accessor entries: readonly DocumentationSearchEntry[] = [];
    @observable accessor loading = false;
    loaded = false;

    constructor(readonly indexUrl: string) {}

    @action
    setEntries(entries: readonly DocumentationSearchEntry[]) {
        this.entries = entries;
        this.loaded = true;
    }

    @action
    finishLoad() {
        this.loading = false;
    }

    @action
    async load() {
        if (this.loaded || this.loading) return;
        this.loading = true;
        try {
            const response = await fetch(this.indexUrl);
            if (!response.ok)
                throw new Error(
                    `Unable to load the search index (HTTP ${response.status}). Build the site before previewing search.`
                );
            const entries: unknown = await response.json();

            if (!Array.isArray(entries) || !entries.every(isSearchEntry))
                throw new Error('The search index has an invalid format.');

            const base = new URL(this.indexUrl, location.href);

            this.setEntries(
                entries.map(({ href, ...entry }) => ({
                    ...entry,
                    href: new URL(href, base).href
                }))
            );
        } finally {
            this.finishLoad();
        }
    }

    @action
    search(query: string) {
        this.query = query;
    }

    @computed
    get results() {
        const words = this.query.trim().toLowerCase().split(/\s+/);

        return this.entries
            .filter(({ title, description }) => {
                const text = `${title} ${description}`.toLowerCase();

                return words.every(word => text.includes(word));
            })
            .slice(0, 20)
            .map(({ description, ...entry }) => {
                const match = description.toLowerCase().indexOf(words[0]);
                const start = Math.max(0, match - 40);
                return {
                    ...entry,
                    description: `${start ? '...' : ''}${description.slice(start, start + 180)}${description.length > start + 180 ? '...' : ''}`
                };
            });
    }
}
