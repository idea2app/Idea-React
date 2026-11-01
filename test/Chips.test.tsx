import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Chip, ChipInput, FormGhost } from '../source/Form';

it('renders chips and chip input options', () => {
    render(
        <ChipInput theme="primary" separator="," maxChips={3}>
            <Chip active>React</Chip>
            <FormGhost aria-label="Add tag" />
        </ChipInput>
    );

    assert.equal(screen.getByText('React').className, 'chip active');
    assert.equal(screen.getByLabelText('Add tag').className, 'form-ghost');
    assert.equal(screen.getByText('React').parentElement?.dataset.bsSeparator, ',');
    assert.equal(screen.getByText('React').parentElement?.dataset.bsMaxChips, '3');
});
