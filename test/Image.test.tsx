import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Image } from '../source/Image';

it('uses Bootstrap 6 responsive and thumbnail image classes', () => {
    render(<Image src="avatar.png" alt="Avatar" className="custom" fluid thumbnail />);

    assert.equal(
        screen.getByRole('img', { name: 'Avatar' }).className,
        'img-fluid img-thumbnail custom'
    );
});
