import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Progress, ProgressStack } from '../../source/Base/Progress';

it('renders accessible labeled progress, themes, stripes and custom range', () => {
    const { rerender } = render(
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
    assert.equal(progress.style.getPropertyValue('--_progress-width'), '25%');
    assert.equal(progress.style.height, '20px');
    assert.equal(screen.getByText('25%').style.width, 'var(--_progress-bar-width, 25%)');
    assert.equal(
        screen.getByText('25%').className,
        'progress-bar theme-success progress-bar-striped progress-bar-animated overflow-visible'
    );
    rerender(<Progress aria-label="Upload" value={200} />);

    assert.equal(progress.getAttribute('aria-valuenow'), '100');
    assert.equal(progress.style.getPropertyValue('--_progress-width'), '100%');
});

it('provides stacked segment sizing without requiring a stylesheet', () => {
    const { container } = render(
        <ProgressStack>
            <Progress aria-label="First" value={15} />
            <Progress aria-label="Second" value={30} theme="info" striped />
        </ProgressStack>
    );
    const stack = container.firstElementChild as HTMLElement;

    assert.equal(stack.className, 'progress-stacked');
    assert.equal(stack.style.getPropertyValue('--_progress-stack-offset'), '0%');
    assert.equal(stack.style.getPropertyValue('--_progress-bar-width'), '100%');
    assert.equal(
        screen
            .getByRole('progressbar', { name: 'Second' })
            .style.getPropertyValue('--_progress-width'),
        '30%'
    );
    assert.equal(
        container.querySelector<HTMLElement>('.progress-bar')?.style.width,
        'var(--_progress-bar-width, 15%)'
    );
});

it('supports explicit outer and inner styles while calculating progress from the range', () => {
    render(
        <Progress
            aria-label="Custom sizing"
            value={20}
            min={10}
            max={30}
            style={{ width: '40%', height: '20px' }}
            barProps={{ style: { width: '75%' } }}
        />
    );
    const progress = screen.getByRole('progressbar', { name: 'Custom sizing' });
    const bar = progress.firstElementChild as HTMLElement;

    assert.equal(progress.style.width, '40%');
    assert.equal(progress.style.height, '20px');
    assert.equal(progress.style.getPropertyValue('--_progress-width'), '50%');
    assert.equal(bar.style.width, '75%');
});

it('rejects invalid progress ranges and non-finite values explicitly', () => {
    assert.throws(() => renderToStaticMarkup(<Progress value={1} min={1} max={1} />), RangeError);
    assert.throws(() => renderToStaticMarkup(<Progress value={NaN} />), RangeError);
});
