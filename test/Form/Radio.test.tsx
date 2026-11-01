import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Radio } from '../../source/Form';

it('renders themed radio inputs and sizes', () => {
    render(
        <>
            <Radio aria-label="Primary" name="choice" theme="primary" />
            <Radio aria-label="Small" name="choice" size="sm" />
        </>
    );
    assert.equal(screen.getByLabelText('Primary').className, 'radio theme-primary');
    assert.equal(screen.getByLabelText('Small').className, 'radio radio-sm');
});
