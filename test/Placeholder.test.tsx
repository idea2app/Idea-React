import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render } from '@testing-library/react';

import { Placeholder, PlaceholderAnimation, PlaceholderButton } from '../source/Placeholder';

it('wraps sized, colored, animated skeletons and disabled placeholder buttons', () => {
    const { container } = render(
        <PlaceholderAnimation animation="pulse">
            <Placeholder size="xs" theme="primary" width="25%" className="custom" />
            <Placeholder size="sm" animation="wave" style={{ width: '75%' }} />
            <Placeholder size="lg" animation="glow" />
            <PlaceholderButton variant="solid" theme="primary">
                Loading
            </PlaceholderButton>
        </PlaceholderAnimation>
    );
    const [first, second, third] = [...container.querySelectorAll('span')];

    assert.equal(container.firstElementChild?.className, 'placeholder-pulse');
    assert.equal(first.className, 'placeholder placeholder-xs bg-primary custom');
    assert.equal(first.style.width, '25%');
    assert.equal(first.getAttribute('aria-hidden'), 'true');
    assert.equal(second.style.width, '75%');
    assert.equal(second.className, 'placeholder placeholder-sm placeholder-wave');
    assert.equal(third.className, 'placeholder placeholder-lg placeholder-glow');
    assert.equal(container.querySelector('button')?.disabled, true);
    assert.match(container.querySelector('button')!.className, /placeholder/);
});
