import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Progress, ProgressStack } from '../source/Progress';

it('renders accessible labeled progress, themes, stripes and custom range', () => {
    const { container, rerender } = render(
        <Progress
            aria-label="Upload"
            value={15}
            min={10}
            max={30}
            theme="success"
            style={{ height: 20 }}
            barProps={{ className: 'overflow-visible' }}
            animated
        >
            25%
        </Progress>
    );
    const progress = screen.getByRole('progressbar', { name: 'Upload' });

    assert.equal(progress.getAttribute('aria-valuenow'), '15');
    assert.equal(progress.getAttribute('aria-valuemin'), '10');
    assert.equal(progress.getAttribute('aria-valuemax'), '30');
    assert.equal(container.querySelector<HTMLElement>('.progress-bar')?.style.width, '25%');
    assert.equal(progress.style.height, '20px');
    assert.equal(
        screen.getByText('25%').className,
        'progress-bar theme-success progress-bar-striped progress-bar-animated overflow-visible'
    );

    rerender(<Progress aria-label="Upload" value={200} />);

    assert.equal(progress.getAttribute('aria-valuenow'), '100');
    assert.equal(container.querySelector<HTMLElement>('.progress-bar')?.style.width, '100%');
});

it('sets stacked widths on wrappers, leaving the inner bar width to Bootstrap', () => {
    const { container } = render(
        <ProgressStack>
            <Progress aria-label="First" value={15} />
            <Progress aria-label="Second" value={30} theme="info" striped />
        </ProgressStack>
    );

    assert.equal(container.firstElementChild?.className, 'progress-stacked');
    assert.equal(screen.getByRole('progressbar', { name: 'Second' }).style.width, '30%');
    assert.equal(container.querySelector<HTMLElement>('.progress-bar')?.style.width, '');
});

it('rejects invalid progress ranges and non-finite values explicitly', () => {
    assert.throws(() => renderToStaticMarkup(<Progress value={1} min={1} max={1} />), RangeError);
    assert.throws(() => renderToStaticMarkup(<Progress value={NaN} />), RangeError);
});
