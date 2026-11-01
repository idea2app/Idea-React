import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { FormControl, FormFloatingLabel, FormLabel } from '../source/Form';

it('renders floating labels with the always-visible variant', () => {
    render(
        <FormFloatingLabel always>
            <FormControl id="name" placeholder="Name" />
            <FormLabel htmlFor="name">Name</FormLabel>
        </FormFloatingLabel>
    );

    assert.equal(
        screen.getByLabelText('Name').parentElement?.className,
        'form-floating form-floating-always'
    );
});
