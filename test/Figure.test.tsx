import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Figure, FigureCaption, FigureImage } from '../source/Content/Figure';

it('renders Bootstrap figure structure and defaults figure images to fluid', () => {
    render(
        <Figure className="custom">
            <FigureImage src="photo.png" alt="Photo" />
            <FigureCaption>Caption</FigureCaption>
        </Figure>
    );
    const figure = screen.getByRole('figure');
    const image = screen.getByRole('img', { name: 'Photo' });

    assert.equal(figure.className, 'figure custom');
    assert.equal(image.className, 'img-fluid');
    assert.equal(image.parentElement, figure);
    assert.equal(screen.getByText('Caption').className, 'figure-caption');
});

it('allows figure image responsiveness and caption element overrides', () => {
    render(
        <Figure>
            <FigureImage fluid={false} src="photo.png" alt="Photo" />
            <FigureCaption as="p">Caption</FigureCaption>
        </Figure>
    );
    assert.equal(screen.getByRole('img', { name: 'Photo' }).className, '');
    assert.equal(screen.getByText('Caption').tagName, 'P');
});
