import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { ListGroup, ListGroupItem } from '../source/ListGroup';

it('renders Bootstrap 6 list groups with variant classes', () => {
    const { container } = render(
        <ListGroup horizontal="md" className="custom" flush numbered>
            <ListGroupItem theme="primary" action active>
                First
            </ListGroupItem>
            <ListGroupItem disabled>Second</ListGroupItem>
        </ListGroup>
    );
    const list = container.firstElementChild as HTMLElement;
    const active = screen.getByText('First');
    const disabled = screen.getByText('Second');

    assert.equal(
        list.className,
        'list-group list-group-flush list-group-numbered md:list-group-horizontal custom'
    );
    assert.equal(active.className, 'list-group-item list-group-item-action active theme-primary');
    assert.equal(active.getAttribute('aria-current'), 'true');
    assert.equal(disabled.className, 'list-group-item disabled');
    assert.equal(disabled.getAttribute('aria-disabled'), 'true');
});
