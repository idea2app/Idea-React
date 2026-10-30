'use client';

import { observer } from 'mobx-react';
import { ChangeEvent, Component, createRef } from 'react';

import { Button } from '../../../../source/Button';
import { Icon } from '../../../../source/Icon';
import { NativeDialog } from '../../../../source/NativeDialog';
import { DocumentationSearchModel } from './model';
import styles from './style.module.less';

export interface DocumentationSearchProps {
    indexUrl: string;
}

@observer
export class DocumentationSearch extends Component<DocumentationSearchProps> {
    dialog = createRef<NativeDialog>();
    input = createRef<HTMLInputElement>();
    model = new DocumentationSearchModel(this.props.indexUrl);

    componentDidMount() {
        document.addEventListener('keydown', this.handleShortcut);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleShortcut);
    }

    open = () => {
        this.dialog.current?.show();
        this.input.current?.focus();
        void this.model.load();
    };

    close = () => this.dialog.current?.close();

    handleSearch = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
        this.model.search(value);

    handleShortcut = (event: KeyboardEvent) => {
        const { key, ctrlKey, metaKey } = event;

        if (key === 'Escape' && this.dialog.current?.open) return this.dialog.current.close();

        if ((ctrlKey || metaKey) && key.toLowerCase() === 'k') {
            event.preventDefault();
            if (!this.dialog.current?.open) this.open();
        }
    };

    renderSearchForm() {
        return (
            <div className="d-flex align-items-center gap-4">
                <Icon name="search" aria-hidden="true" />
                <input
                    ref={this.input}
                    className="form-control min-w-0"
                    type="search"
                    aria-label="Search documentation"
                    placeholder="Search documentation..."
                    value={this.model.query}
                    onChange={this.handleSearch}
                />
                <Button variant="text" type="button" onClick={this.close}>
                    Close
                </Button>
            </div>
        );
    }

    renderResults() {
        const { results, loading } = this.model;

        if (loading) return <p role="status">Loading search index...</p>;

        return (
            <>
                <ul className="list-unstyled my-5" aria-label="Search results">
                    {results.map(({ href, title, description }) => (
                        <li key={href}>
                            <a
                                className="menu-item d-grid gap-1 rounded-5 p-4 text-wrap text-decoration-none"
                                href={href}
                                onClick={this.close}
                            >
                                <strong>{title}</strong>
                                <span className="fg-2 text-sm">{description}</span>
                            </a>
                        </li>
                    ))}
                </ul>
                {!results.length && <p role="status">No results found.</p>}
            </>
        );
    }

    render() {
        return (
            <>
                <Button
                    className={`${styles.trigger} order-3 w-100 d-flex align-items-center gap-3 rounded-7 border bg-1 fg-2 px-4 py-3 text-sm text-start`}
                    type="button"
                    onClick={this.open}
                >
                    <Icon name="search" aria-hidden="true" />
                    <span>Search docs...</span>
                    <kbd className="ms-auto text-xs">Ctrl K</kbd>
                </Button>
                <NativeDialog
                    ref={this.dialog}
                    className={`${styles.dialog} p-5 overflow-y-auto`}
                    aria-label="Search documentation"
                >
                    {this.renderSearchForm()}
                    {this.renderResults()}
                    <p className="fg-2 text-sm mb-0">
                        Search this documentation. Press Escape to close.
                    </p>
                </NativeDialog>
            </>
        );
    }
}
