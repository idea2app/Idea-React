import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Image } from '../source/Base/Image';

it('uses Bootstrap 6 responsive and thumbnail image classes', () => {
    render(<Image src="avatar.png" alt="Avatar" className="custom" fluid thumbnail />);

    assert.equal(
        screen.getByRole('img', { name: 'Avatar' }).className,
        'img-fluid img-thumbnail custom'
    );
});

it('supports independent rounded styles and preserves native props and refs', () => {
    const ref = createRef<HTMLImageElement>();
    const { rerender } = render(
        <Image ref={ref} src="portrait.png" alt="Portrait" width={80} rounded roundedCircle />
    );
    const image = screen.getByRole('img', { name: 'Portrait' });

    assert.equal(ref.current, image);
    assert.equal(image.getAttribute('width'), '80');
    assert.equal(image.className, 'rounded rounded-circle');
    assert.equal(image.hasAttribute('rounded'), false);
    assert.equal(image.hasAttribute('roundedCircle'), false);

    rerender(<Image src="portrait.png" alt="Portrait" />);

    assert.equal(image.className, '');
});
