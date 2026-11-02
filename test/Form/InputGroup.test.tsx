import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import {
    FormControl,
    InputGroup,
    InputGroupButton,
    InputGroupIgnore,
    InputGroupMenu,
    InputGroupText
} from '../../source/Form';

it('renders a sized input group and its addon', () => {
    render(
        <InputGroup size="lg">
            <InputGroupText>@</InputGroupText>
            <FormControl aria-label="Username" />
        </InputGroup>
    );
    assert.equal(screen.getByText('@').className, 'input-group-text');
    assert.equal(screen.getByText('@').parentElement?.className, 'input-group input-group-lg');
});

it('renders direct-child dropdown and segmented menu addons with inherited keyboard behavior', () => {
    render(
        <InputGroup>
            <InputGroupButton variant="outline">Action</InputGroupButton>
            <InputGroupMenu label="More" toggleProps={{ variant: 'outline' }} split>
                <button type="button">Item</button>
            </InputGroupMenu>
            <FormControl aria-label="Value" />
        </InputGroup>
    );
    const trigger = screen.getByRole('button', { name: 'Toggle menu' });

    assert.ok(trigger.parentElement?.classList.contains('input-group'));
    assert.ok(trigger.classList.contains('menu-toggle-split'));

    fireEvent.click(trigger);

    assert.equal(screen.getByRole('button', { name: 'Item' }).parentElement?.hidden, false);

    fireEvent.keyDown(trigger, { key: 'Escape' });

    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
});

it('wraps menu buttons and excludes feedback from border-radius calculations', () => {
    render(
        <InputGroup>
            <InputGroupButton variant="outline">Action</InputGroupButton>
            <FormControl aria-label="Value" />
            <InputGroupIgnore>
                <span>Feedback</span>
            </InputGroupIgnore>
        </InputGroup>
    );

    assert.ok(screen.getByRole('button').classList.contains('input-group-btn'));
    assert.equal(screen.getByText('Feedback').className, 'input-group-ignore');
});
