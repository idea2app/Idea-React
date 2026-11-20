'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, MouseEvent } from 'react';

import { Menu, MenuItem } from '../../../../source/Base/Menu';
import { Navbar, NavbarBrand } from '../../../../source/Base/Navbar';
import { Icon } from '../../../../source/Extension/Icon';
import { FormLabel } from '../../../../source/Form';
import { Container } from '../../../../source/Layout/Grid';
import { CodeExample } from '../Example';
import styles from './style.module.css';

const placements = ['', 'fixed-top', 'fixed-bottom', 'sticky-top', 'sticky-bottom'] as const;

type Placement = (typeof placements)[number];

const labels: Record<Placement, string> = {
    '': 'Default',
    'fixed-top': 'Fixed top',
    'fixed-bottom': 'Fixed bottom',
    'sticky-top': 'Sticky top',
    'sticky-bottom': 'Sticky bottom'
};

@observer
export class NavbarPlacement extends Component {
    static displayName = 'NavbarPlacement';

    @observable accessor placement: Placement = '';

    handleSelect = action(({ target }: MouseEvent<HTMLDivElement>) => {
        if (!(target instanceof Element)) return;

        const button = target.closest<HTMLButtonElement>('button[data-placement]');
        const placement = placements.find(value => value === button?.dataset.placement);

        if (placement !== undefined) this.placement = placement;
    });

    renderPlacement = (placement: Placement) => (
        <MenuItem key={placement} active={this.placement === placement} data-placement={placement}>
            {placement ? labels[placement] : 'Default (static)'}
        </MenuItem>
    );

    render() {
        const { placement } = this;
        const label = labels[placement];
        const className = classNames('bg-1', placement);
        const sticky = placement === 'sticky-top' || placement === 'sticky-bottom';
        const scrollContent = (
            <div className={`p-3 ${styles.scrollContent}`}>
                Scroll to see the navbar stay in place.
            </div>
        );
        const code = `<Navbar className="${className}">
    <Container fluid>
        <NavbarBrand href="#placement">${label}</NavbarBrand>
    </Container>
</Navbar>`;

        return (
            <div onClick={this.handleSelect}>
                <div className="bg-1 p-3 fs-sm rounded-3 mb-3">
                    <FormLabel htmlFor="navbar-placement-toggle" className="fw-semibold mb-1">
                        Placement
                    </FormLabel>
                    <div>
                        <Menu
                            label={
                                <>
                                    <span>{placement ? label : 'Default (static)'}</span>
                                    <Icon name="chevron-expand" className="ms-1" size={1} />
                                </>
                            }
                            toggleProps={{
                                id: 'navbar-placement-toggle',
                                variant: 'outline',
                                theme: 'secondary'
                            }}
                        >
                            {placements.map(this.renderPlacement)}
                        </Menu>
                    </div>
                </div>

                <CodeExample code={code}>
                    <div
                        className={classNames(
                            'position-relative overflow-auto border rounded',
                            styles.preview,
                            sticky
                                ? styles.stickyPreview
                                : 'd-flex flex-column justify-content-center'
                        )}
                        role={sticky ? 'region' : undefined}
                        aria-label={
                            sticky ? 'Scroll to preview sticky navbar positioning' : undefined
                        }
                        tabIndex={sticky ? 0 : undefined}
                    >
                        {placement === 'sticky-bottom' && scrollContent}

                        <Navbar className={className}>
                            <Container fluid>
                                <NavbarBrand href="#placement">{label}</NavbarBrand>
                            </Container>
                        </Navbar>

                        {placement === 'sticky-top' && scrollContent}
                    </div>
                </CodeExample>
            </div>
        );
    }
}
