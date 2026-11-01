import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { FormFeedback, FormText } from '../../source/Form';

it('renders descriptions and valid or invalid feedback variants', () => {
    render(
        <>
            <FormText>Helper text</FormText>
            <FormFeedback type="valid">Looks good.</FormFeedback>
            <FormFeedback tooltip>Required.</FormFeedback>
        </>
    );
    assert.equal(screen.getByText('Helper text').className, 'form-text');
    assert.equal(screen.getByText('Looks good.').className, 'valid-feedback');
    assert.equal(screen.getByText('Required.').className, 'invalid-tooltip');
});
