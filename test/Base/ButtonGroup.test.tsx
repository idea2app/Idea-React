import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Button } from '../../source/Base/Button';
import { ButtonGroup, ButtonToolbar } from '../../source/Base/ButtonGroup';

it('supports shared sizing and dividers for horizontal and vertical groups', () => {
    const { container, rerender } = render(<ButtonGroup size="xs" divider />);

    assert.equal(
        container.firstElementChild?.className,
        'btn-group btn-group-xs btn-group-divider'
    );
    rerender(<ButtonGroup size="lg" vertical divider />);

    assert.equal(
        container.firstElementChild?.className,
        'btn-group-vertical btn-group-lg btn-group-divider'
    );
});

it('renders a Bootstrap 6 button group', () => {
    render(
        <ButtonGroup className="custom" aria-label="Actions">
            <Button>One</Button>
        </ButtonGroup>
    );
    const group = screen.getByRole('group', { name: 'Actions' });

    assert.equal(group.className, 'btn-group custom');
    assert.equal(screen.getByRole('button', { name: 'One' }).parentElement, group);
});

it('renders a vertical button group', () => {
    render(
        <ButtonGroup aria-label="Vertical actions" vertical>
            <Button>One</Button>
        </ButtonGroup>
    );
    const group = screen.getByRole('group', { name: 'Vertical actions' });

    assert.equal(group.className, 'btn-group-vertical');
});

it('renders a Bootstrap 6 button toolbar', () => {
    render(
        <ButtonToolbar className="justify-content-between" aria-label="Toolbar">
            <ButtonGroup aria-label="Actions">
                <Button>One</Button>
            </ButtonGroup>
        </ButtonToolbar>
    );
    const toolbar = screen.getByRole('toolbar', { name: 'Toolbar' });

    assert.equal(toolbar.className, 'btn-toolbar justify-content-between');
    assert.equal(screen.getByRole('group', { name: 'Actions' }).parentElement, toolbar);
});
