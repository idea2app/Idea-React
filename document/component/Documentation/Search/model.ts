import { action, computed, observable } from 'mobx';

export type DocumentationSearchEntry = Record<'title' | 'href' | 'description', string>;

export class DocumentationSearchModel {
    @observable accessor query = '';
    @observable accessor entries: readonly DocumentationSearchEntry[];

    constructor(entries: readonly DocumentationSearchEntry[]) {
        this.entries = entries;
    }

    @action
    updateEntries(entries: readonly DocumentationSearchEntry[]) {
        this.entries = entries;
    }

    @action
    search(query: string) {
        this.query = query;
    }

    @computed
    get results() {
        const query = this.query.trim().toLowerCase();
        return this.entries.filter(({ title, description }) =>
            `${title} ${description}`.toLowerCase().includes(query)
        );
    }
}
