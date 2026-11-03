import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { Collapse, CollapseToggle } from '../source/Collapse';

it('keeps multiple triggers and multiple horizontal targets synchronized', () => {
    render(
        <>
            <CollapseToggle target=".panels">Both</CollapseToggle>
            <CollapseToggle target="#first" href="#first">
                First
            </CollapseToggle>
            <Collapse id="first" className="panels" horizontal>
                First panel
            </Collapse>
            <Collapse id="second" className="panels">
                Second panel
            </Collapse>
        </>
    );
    const both = screen.getByRole('button', { name: 'Both' });
    const first = screen.getByRole('button', { name: 'First' });

    assert.equal(both.getAttribute('aria-expanded'), 'false');
    assert.equal(both.getAttribute('aria-controls'), 'first second');
    assert.equal(screen.getByText('First panel').className, 'collapse collapse-horizontal panels');

    fireEvent.click(both);

    assert.equal(both.getAttribute('aria-expanded'), 'true');
    assert.equal(first.getAttribute('aria-expanded'), 'true');
    assert.match(screen.getByText('Second panel').className, /show/);

    fireEvent.click(first);

    assert.equal(first.getAttribute('aria-expanded'), 'false');
    assert.equal(both.getAttribute('aria-expanded'), 'true');
});

it('supports controlled open state, change callbacks, cancellation and parent exclusivity', () => {
    const onOpenChange = mock.fn();

    const { rerender } = render(
        <>
            <CollapseToggle target="#controlled">Toggle controlled</CollapseToggle>
            <Collapse id="controlled" open={false} onOpenChange={onOpenChange}>
                Controlled
            </Collapse>
        </>
    );
    fireEvent.click(screen.getByRole('button'));

    assert.equal(onOpenChange.mock.calls[0].arguments[0], true);
    assert.equal(screen.getByText('Controlled').className, 'collapse');

    rerender(
        <div id="group">
            <CollapseToggle target="#one">One</CollapseToggle>
            <CollapseToggle target="#two">Two</CollapseToggle>
            <Collapse id="one" parent="#group" defaultOpen>
                Panel one
            </Collapse>
            <Collapse id="two" parent="#group">
                Panel two
            </Collapse>
        </div>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Two' }));

    assert.equal(screen.getByText('Panel one').className, 'collapse');
    assert.equal(screen.getByText('Panel two').className, 'collapse show');
    assert.equal(
        screen.getByRole('button', { name: 'One' }).getAttribute('aria-expanded'),
        'false'
    );
});

it('allows consumer click cancellation and releases document listeners on unmount', () => {
    const onOpenChange = mock.fn();

    const { unmount } = render(
        <>
            <CollapseToggle target="#cancelled" onClick={event => event.preventDefault()}>
                Cancelled
            </CollapseToggle>
            <Collapse id="cancelled" onOpenChange={onOpenChange}>
                Panel
            </Collapse>
        </>
    );
    fireEvent.click(screen.getByRole('button'));

    assert.equal(onOpenChange.mock.callCount(), 0);

    unmount();
    document.dispatchEvent(new Event('idea-react:collapse-change'));

    assert.equal(onOpenChange.mock.callCount(), 0);
});

it('does not group unrelated panels when the parent selector matches no container', () => {
    render(
        <>
            <Collapse id="outside-one" parent="#not-present" defaultOpen>
                Outside one
            </Collapse>
            <Collapse id="outside-two" parent="#not-present" defaultOpen>
                Outside two
            </Collapse>
        </>
    );
    assert.equal(screen.getByText('Outside one').className, 'collapse show');
    assert.equal(screen.getByText('Outside two').className, 'collapse show');
});
