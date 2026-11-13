'use client';

import { observer } from 'mobx-react';
import { ChangeEvent, Component, createRef } from 'react';

import { Button } from '../../../../source/Base/Button';
import { CloseButton } from '../../../../source/Base/CloseButton';
import { Dialog } from '../../../../source/Base/Dialog';
import {
    MenuItem,
    MenuItemContent,
    MenuItemDescription,
    MenuPanel
} from '../../../../source/Base/Menu';
import { Placeholder } from '../../../../source/Base/Placeholder';
import { Icon } from '../../../../source/Extension/Icon';
import { FormAdornment, FormAdornmentIcon, FormGhost } from '../../../../source/Form';
import { DocumentSearchModel } from './model';
import styles from './style.module.less';

export interface DocumentSearchProps {
    indexUrl: string;
}

@observer
export class DocumentSearch extends Component<DocumentSearchProps> {
    dialog = createRef<Dialog>();
    input = createRef<HTMLInputElement>();
    model = new DocumentSearchModel(this.props.indexUrl);

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

        if (key === 'Escape' && this.dialog.current?.open) {
            this.dialog.current.close();
        } else if ((ctrlKey || metaKey) && key.toLowerCase() === 'k') {
            event.preventDefault();
            if (!this.dialog.current?.open) this.open();
        }
    };

    renderSearchForm() {
        return (
            <header className="sticky-top z-1 bg-1 d-flex align-items-center gap-4 p-5 border-bottom">
                <FormAdornment className="flex-grow-1 min-w-0">
                    <FormAdornmentIcon name="search" aria-hidden="true" />
                    <FormGhost
                        ref={this.input}
                        type="search"
                        aria-label="Search documentation"
                        placeholder="Search documentation..."
                        value={this.model.query}
                        onChange={this.handleSearch}
                    />
                </FormAdornment>
                <CloseButton aria-label="Close search" onClick={this.close} />
            </header>
        );
    }

    renderResults() {
        const { results, loading } = this.model;

        return loading ? (
            <div className="my-5" role="status">
                <p className="mb-4">Loading search index...</p>
                <Placeholder as="div" animation="wave" className="d-grid gap-3">
                    <Placeholder as="div" className="w-100" />
                    <Placeholder as="div" className="w-75" />
                    <Placeholder as="div" className="w-100" />
                    <Placeholder as="div" className="w-50" />
                </Placeholder>
            </div>
        ) : (
            <>
                <MenuPanel
                    as="ul"
                    className="position-static w-100 list-unstyled my-5"
                    aria-label="Search results"
                    show
                >
                    {results.map(({ href, title, description }) => (
                        <li key={href}>
                            <MenuItem
                                href={href}
                                variant={false}
                                className={`d-grid gap-1 rounded-5 p-4 text-wrap text-decoration-none ${styles.resultItem}`}
                                onClick={this.close}
                            >
                                <MenuItemContent as="strong">{title}</MenuItemContent>
                                <MenuItemDescription className="fg-2 text-sm">
                                    {description}
                                </MenuItemDescription>
                            </MenuItem>
                        </li>
                    ))}
                </MenuPanel>
                {!results.length && <p role="status">No results found.</p>}
            </>
        );
    }

    render() {
        return (
            <>
                <Button
                    className="order-3 lg:order-0 w-100 lg:w-auto flex-grow-1 min-w-0 d-flex align-items-center gap-3 rounded-7 border bg-1 fg-2 px-4 py-3 text-sm text-start"
                    onClick={this.open}
                >
                    <Icon name="search" aria-hidden="true" />
                    <span>Search docs...</span>
                    <kbd className="ms-auto text-xs">Ctrl K</kbd>
                </Button>
                <Dialog
                    ref={this.dialog}
                    className={`${styles.dialog} p-0 overflow-y-auto`}
                    aria-label="Search documentation"
                >
                    {this.renderSearchForm()}
                    <div className="px-5 pb-5">
                        {this.renderResults()}
                        <p className="fg-2 text-sm mb-0">
                            Search this documentation. Press Escape to close.
                        </p>
                    </div>
                </Dialog>
            </>
        );
    }
}
