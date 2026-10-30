import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from '../source/Button';

it('maps official variants, themes, sizes, and native button behavior', () => {
    const onClick = mock.fn();
    render(
        <Button variant="outline" theme="accent" size="lg" onClick={onClick}>
            Save
        </Button>
    );
    const button = screen.getByRole('button', { name: 'Save' });
    assert.ok(button.className.includes('btn-outline theme-accent btn-lg'));
    assert.equal(button.getAttribute('type'), 'button');

    fireEvent.click(button);
    assert.equal(onClick.mock.callCount(), 1);
});

it('preserves submit semantics and disables buttons and links', () => {
    const onClick = mock.fn();
    render(
        <>
            <Button type="submit" disabled>
                Submit
            </Button>
            <Button href="/docs" disabled onClick={onClick}>
                Docs
            </Button>
        </>
    );
    assert.equal(screen.getByText('Submit').getAttribute('type'), 'submit');
    assert.equal(screen.getByText('Submit').hasAttribute('disabled'), true);

    const link = screen.getByText('Docs');
    assert.equal(link.getAttribute('href'), null);
    assert.equal(link.getAttribute('aria-disabled'), 'true');
    assert.equal(link.getAttribute('tabindex'), '-1');

    fireEvent.click(link);
    assert.equal(onClick.mock.callCount(), 0);
});

it('renders a link without button-only attributes', () => {
    render(
        <Button href="/docs" variant="solid" theme="primary">
            Docs
        </Button>
    );
    assert.equal(screen.getByRole('link').getAttribute('href'), '/docs');
    assert.equal(screen.getByRole('link').hasAttribute('disabled'), false);
});
