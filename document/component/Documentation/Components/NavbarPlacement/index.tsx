'use client';

import classNames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, MouseEvent } from 'react';

import { FormLabel } from '../../../../../source/Form';
import { Container } from '../../../../../source/Grid';
import { Menu, MenuItem } from '../../../../../source/Menu';
import { Navbar, NavbarBrand } from '../../../../../source/Navbar';
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
                            label={placement ? label : 'Default (static)'}
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
                        className={`position-relative overflow-auto border rounded ${styles.preview}`}
                    >
                        <Navbar className={className}>
                            <Container fluid>
                                <NavbarBrand href="#placement">{label}</NavbarBrand>
                            </Container>
                        </Navbar>
                    </div>
                </CodeExample>
            </div>
        );
    }
}
