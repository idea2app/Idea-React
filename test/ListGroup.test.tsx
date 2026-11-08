import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { ListGroup, ListGroupItem } from '../source/Base/ListGroup';

it('supports ordered numbered lists and action-only containers', () => {
    const { container, rerender } = render(<ListGroup as="ol" start={3} numbered />);

    assert.equal(container.firstElementChild?.tagName, 'OL');
    assert.equal(container.firstElementChild?.getAttribute('start'), '3');
    assert.equal(container.firstElementChild?.className, 'list-group list-group-numbered');

    rerender(
        <ListGroup as="div">
            <ListGroupItem type="button">Action</ListGroupItem>
        </ListGroup>
    );
    assert.equal(container.firstElementChild?.tagName, 'DIV');
    assert.equal(screen.getByRole('button', { name: 'Action' }).tagName, 'BUTTON');
});

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
    assert.equal(active.className, 'list-group-item theme-primary list-group-item-action active');
    assert.equal(active.getAttribute('aria-current'), 'true');
    assert.equal(disabled.className, 'list-group-item disabled pe-none');
    assert.equal(disabled.getAttribute('aria-disabled'), 'true');
});

it('renders actionable items as links and buttons', () => {
    render(
        <ListGroup>
            <ListGroupItem href="#" action active>
                Current link
            </ListGroupItem>
            <ListGroupItem href="#" action disabled>
                Disabled link
            </ListGroupItem>
            <ListGroupItem type="button" theme="primary" action>
                Button item
            </ListGroupItem>
        </ListGroup>
    );
    const current = screen.getByText('Current link');
    const disabled = screen.getByText('Disabled link');
    const button = screen.getByText('Button item');

    assert.equal(current.tagName, 'A');
    assert.equal(current.className, 'list-group-item list-group-item-action active');
    assert.equal(current.getAttribute('href'), '#');
    assert.equal(current.getAttribute('aria-current'), 'true');

    assert.equal(disabled.tagName, 'A');
    assert.equal(disabled.getAttribute('href'), null);
    assert.equal(disabled.className, 'list-group-item list-group-item-action disabled pe-none');
    assert.equal(disabled.getAttribute('aria-disabled'), 'true');
    assert.equal(disabled.getAttribute('tabindex'), '-1');

    assert.equal(button.tagName, 'BUTTON');
    assert.equal(button.getAttribute('type'), 'button');
    assert.equal(button.className, 'list-group-item theme-primary list-group-item-action');
});
