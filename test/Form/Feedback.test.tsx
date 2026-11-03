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
    assert.equal(screen.getByText('Required.').className, 'tooltip invalid-tooltip');
});

it('provides base tooltip styling for both validation states while forwarding native props', () => {
    render(
        <FormFeedback
            id="valid-tooltip"
            type="valid"
            className="position-static"
            role="status"
            tooltip
        >
            Saved.
        </FormFeedback>
    );
    const feedback = screen.getByRole('status');

    assert.equal(feedback.id, 'valid-tooltip');
    assert.equal(feedback.className, 'tooltip valid-tooltip position-static');
});

it('preserves inline helper text by default and supports upstream block descriptions', () => {
    render(
        <>
            <FormText>Inline helper</FormText>
            <FormText id="block-help" className="mb-2" block>
                Block helper
            </FormText>
        </>
    );
    assert.equal(screen.getByText('Inline helper').className, 'form-text');
    assert.equal(screen.getByText('Block helper').className, 'form-text d-block mb-2');
    assert.equal(screen.getByText('Block helper').id, 'block-help');
    assert.equal(screen.getByText('Block helper').hasAttribute('block'), false);
});
