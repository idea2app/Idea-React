import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { FormControl, InputGroup, InputGroupText } from '../../source/Form';

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
