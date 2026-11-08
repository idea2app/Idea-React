import { action, computed, observable } from 'mobx';

export type DocumentSearchEntry = Record<'title' | 'href' | 'description', string>;

export class DocumentSearchModel {
    @observable accessor query = '';
    @observable accessor entries: readonly DocumentSearchEntry[] = [];
    @observable accessor loading = false;
    loaded = false;

    constructor(readonly indexUrl: string) {}

    @action
    setEntries(entries: readonly DocumentSearchEntry[]) {
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
                throw new Error(`Unable to load the search index (HTTP ${response.status}).`);
            const feed = new DOMParser().parseFromString(await response.text(), 'application/xml');
            const channel = feed.querySelector('rss[version="2.0"] > channel');
            if (feed.querySelector('parsererror') || !channel)
                throw new Error('The search RSS feed has an invalid format.');
            const base = new URL(this.indexUrl, location.href);
            const entries = [...channel.querySelectorAll(':scope > item')].map(item => {
                const title = item.querySelector(':scope > title')?.textContent;
                const href = item.querySelector(':scope > link')?.textContent;
                const description = item.querySelector(':scope > description')?.textContent;

                if (!title?.trim() || !href?.trim() || description == null)
                    throw new Error('The search RSS feed contains an invalid item.');
                const url = new URL(href.trim(), base);
                if (!['http:', 'https:'].includes(url.protocol))
                    throw new Error('The search RSS feed contains an invalid page URL.');

                return { title, href: url.href, description };
            });

            this.setEntries(entries);
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
            .map(entry => ({
                entry,
                titleMatches: words.filter(word => entry.title.toLowerCase().includes(word)).length
            }))
            .sort((left, right) => right.titleMatches - left.titleMatches)
            .slice(0, 20)
            .map(({ entry: { description, ...entry } }) => {
                const match = description.toLowerCase().indexOf(words[0]);
                const start = Math.max(0, match - 40);
                return {
                    ...entry,
                    description: `${start ? '...' : ''}${description.slice(start, start + 180)}${description.length > start + 180 ? '...' : ''}`
                };
            });
    }
}
