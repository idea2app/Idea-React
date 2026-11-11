import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Ratio } from '../../source/Layout/Ratio';

it('applies Bootstrap 6 aspect-ratio utility classes to the root element', () => {
    render(
        <Ratio
            as="iframe"
            className="w-100"
            aspectRatio="16x9"
            title="Video"
            src="video.mp4"
            allowFullScreen
        />
    );
    const video = screen.getByTitle('Video');

    assert.equal(video.tagName, 'IFRAME');
    assert.equal(video.className, 'ratio-16x9 w-100');
    assert.equal(video.getAttribute('src'), 'video.mp4');
    assert.equal(video.hasAttribute('allowfullscreen'), true);
});

it('supports the default ratio, custom classes, and polymorphic elements', () => {
    render(
        <Ratio as="section" className="custom">
            Content
        </Ratio>
    );
    const section = screen.getByText('Content');

    assert.equal(section.tagName, 'SECTION');
    assert.equal(section.className, 'ratio-1x1 custom');
});

it('supports custom aspect ratios while preserving caller styles', () => {
    render(
        <Ratio aspectRatio="2 / 1" style={{ color: 'red' }}>
            Content
        </Ratio>
    );
    const ratio = screen.getByText('Content');

    assert.equal(ratio.className, 'ratio-auto');
    assert.equal(ratio.style.getPropertyValue('--bs-ratio'), '2 / 1');
    assert.equal(ratio.style.color, 'red');
});
