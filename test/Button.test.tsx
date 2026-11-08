import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Button, ButtonInput } from '../source/Base/Button';

it('preserves button names in client-rendered documentation examples', () => {
    assert.equal(Button.displayName, 'Button');
    assert.equal(ButtonInput.displayName, 'ButtonInput');
});

it('defaults buttons, links, inputs and toggles to unthemed base styling', () => {
    render(
        <>
            <Button>Button</Button>
            <Button href="/docs">Link</Button>
            <ButtonInput value="Input" />
        </>
    );
    for (const name of ['Button', 'Input'])
        assert.equal(screen.getByRole('button', { name }).className, 'btn');

    assert.equal(screen.getByRole('link', { name: 'Link' }).className, 'btn');
});

it('preserves explicit variants and themes for buttons and inputs', () => {
    render(
        <>
            <Button variant="text" theme="secondary">
                Custom button
            </Button>
            <ButtonInput variant="outline" theme="danger" value="Custom input" />
            <ButtonInput aria-label="Icon input" icon />
        </>
    );
    assert.equal(screen.getByText('Custom button').className, 'btn-text theme-secondary');
    assert.equal(
        screen.getByRole('button', { name: 'Custom input' }).className,
        'btn-outline theme-danger'
    );
    assert.equal(screen.getByRole('button', { name: 'Icon input' }).className, 'btn btn-icon');
});

it('allows composite controls to opt out of button styling without losing behavior', () => {
    render(
        <>
            <Button variant={false} className="form-control">
                Control
            </Button>
            <ButtonInput variant={false} className="form-control" value="Input control" />
            <Button variant={false} href="/docs" className="custom">
                Unstyled link
            </Button>
            <Button variant={false} active>
                Unstyled active button
            </Button>
        </>
    );
    assert.equal(screen.getByRole('button', { name: 'Control' }).className, 'form-control');
    assert.equal(screen.getByRole('button', { name: 'Input control' }).className, 'form-control');
    assert.equal(screen.getByRole('link').className, 'custom');

    assert.equal(
        screen.getByRole('button', { name: 'Unstyled active button' }).className,
        'active'
    );
});

it('preserves native keyboard events and forwards each synthesized click only once', () => {
    const onClick = mock.fn();
    const onKeyDown = mock.fn();
    const onKeyUp = mock.fn();
    render(
        <Button variant="link" onClick={onClick} onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
            Native activation
        </Button>
    );
    const button = screen.getByRole('button', { name: 'Native activation' });

    for (const key of ['Enter', ' ']) {
        assert.equal(fireEvent.keyDown(button, { key }), true);
        assert.equal(fireEvent.keyUp(button, { key }), true);

        assert.equal(onClick.mock.callCount(), key === 'Enter' ? 0 : 1);

        fireEvent.click(button, { detail: 0 });
    }
    assert.equal(onClick.mock.callCount(), 2);
    assert.equal(onKeyDown.mock.callCount(), 2);
    assert.equal(onKeyUp.mock.callCount(), 2);
});

it('supports controlled active state and native input button tags', () => {
    const { rerender } = render(<Button active>Pressed</Button>);

    assert.equal(screen.getByRole('button').getAttribute('aria-pressed'), 'true');

    rerender(<Button>Pressed</Button>);

    assert.equal(screen.getByRole('button').getAttribute('aria-pressed'), null);

    rerender(
        <ButtonInput type="submit" value="Submit" variant="subtle" theme="primary" size="xs" />
    );
    assert.equal(
        screen.getByRole('button', { name: 'Submit' }).className,
        'btn-subtle theme-primary btn-xs'
    );
    assert.equal(screen.getByRole('button').tagName, 'INPUT');
});

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

it('supports link variants, extra small sizes, and standalone icon buttons', () => {
    render(
        <>
            <Button variant="link" theme="primary" size="xs">
                Link button
            </Button>
            <Button aria-label="Confirm" icon>
                <span aria-hidden="true" />
            </Button>
        </>
    );
    assert.equal(
        screen.getByRole('button', { name: 'Link button' }).className,
        'btn-link theme-primary btn-xs'
    );
    assert.equal(screen.getByRole('button', { name: 'Confirm' }).className, 'btn-icon');
});
