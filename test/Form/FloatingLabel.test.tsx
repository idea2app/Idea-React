import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { FormControl, FormFloatingLabel, FormLabel } from '../../source/Form';

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
    assert.equal(screen.getByLabelText('Name').previousElementSibling?.tagName, 'LABEL');
});

it('moves native labels ahead of controls while preserving other children and attributes', () => {
    const { container, rerender } = render(
        <FormFloatingLabel id="floating" className="custom" data-example="native">
            <input id="email" placeholder="Email" />
            <span>Help</span>
            <label htmlFor="email">Email</label>
        </FormFloatingLabel>
    );
    const wrapper = container.firstElementChild!;

    assert.equal(wrapper.className, 'form-floating custom');
    assert.equal(wrapper.getAttribute('data-example'), 'native');
    assert.deepEqual(
        [...wrapper.children].map(({ tagName }) => tagName),
        ['LABEL', 'INPUT', 'SPAN']
    );

    rerender(
        <FormFloatingLabel>
            <FormLabel htmlFor="message">Message</FormLabel>
            <textarea id="message" placeholder="Message" />
        </FormFloatingLabel>
    );
    assert.equal(screen.getByLabelText('Message').previousElementSibling?.tagName, 'LABEL');
});
