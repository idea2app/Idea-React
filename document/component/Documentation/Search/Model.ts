import { action, computed, observable } from 'mobx';

export interface DocumentationSearchEntry {
    title: string;
    href: string;
    description: string;
}

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
