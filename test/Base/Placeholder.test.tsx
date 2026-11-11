import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render } from '@testing-library/react';

import { Placeholder, PlaceholderButton } from '../../source/Base/Placeholder';

it('wraps sized, colored, animated skeletons and disabled placeholder buttons', () => {
    const { container } = render(
        <Placeholder as="div" animation="pulse" className="d-grid gap-3">
            <Placeholder size="xs" theme="primary" width="25%" className="custom" />
            <Placeholder size="sm" style={{ width: '75%' }} />
            <Placeholder size="lg" />
            <PlaceholderButton variant="solid" theme="primary">
                Loading
            </PlaceholderButton>
        </Placeholder>
    );
    const [first, second, third] = container.querySelectorAll('span');

    assert.equal(container.firstElementChild?.className, 'placeholder-pulse d-grid gap-3');
    assert.equal(first.className, 'placeholder placeholder-xs bg-primary custom');
    assert.equal(first.style.width, '25%');
    assert.equal(first.getAttribute('aria-hidden'), 'true');
    assert.equal(second.style.width, '75%');
    assert.equal(second.className, 'placeholder placeholder-sm');
    assert.equal(third.className, 'placeholder placeholder-lg');
    assert.equal(container.querySelector('button')?.disabled, true);
    assert.match(container.querySelector('button')!.className, /placeholder/);
});

it('uses one component for animated text and placeholder groups', () => {
    const { container } = render(
        <Placeholder as="p" animation="wave" className="fg-3">
            Working on it…
        </Placeholder>
    );
    const animation = container.firstElementChild;

    assert.equal(animation?.className, 'placeholder-wave fg-3');
    assert.equal(animation?.textContent, 'Working on it…');
    assert.equal(animation?.getAttribute('aria-hidden'), 'true');
});

it('preserves the button line height when no placeholder content is provided', () => {
    const { container } = render(<PlaceholderButton variant="solid" theme="primary" />);

    assert.equal(container.querySelector('button')?.textContent, '\u00a0');
});
