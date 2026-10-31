import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Button } from '../source/Button';
import { ButtonGroup } from '../source/ButtonGroup';

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
