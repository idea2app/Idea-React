import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Tab, Tabs } from '../source/Tab';

const tabs = [
    <Tab key="home" eventKey="home" label="Home">
        Home panel
    </Tab>,
    <Tab key="profile" eventKey="profile" label="Profile">
        Profile panel
    </Tab>,
    <Tab key="disabled" eventKey="disabled" label="Disabled" disabled>
        Disabled panel
    </Tab>,
    <Tab key="contact" eventKey="contact" label="Contact">
        Contact panel
    </Tab>
];

it('renders tab semantics safely during server-side rendering', () => {
    const markup = renderToStaticMarkup(<Tabs id="server-tabs">{tabs}</Tabs>);

    assert.match(markup, /role="tablist"/);
    assert.match(markup, /role="tabpanel"/);
});

it('activates tabs with clicks and keyboard while maintaining the tab-panel relationship', () => {
    const onChange = mock.fn();
    render(
        <Tabs id="account-tabs" onChange={onChange}>
            {tabs}
        </Tabs>
    );

    const home = screen.getByRole('tab', { name: 'Home' });
    const profile = screen.getByRole('tab', { name: 'Profile' });
    assert.equal(home.getAttribute('aria-controls'), 'account-tabs-panel-home');
    assert.equal(screen.getByRole('tabpanel', { name: 'Home' }).hidden, false);

    fireEvent.keyDown(home, { key: 'ArrowRight' });

    assert.equal(profile.getAttribute('aria-selected'), 'true');
    assert.equal(screen.getByRole('tabpanel', { name: 'Profile' }).hidden, false);
    assert.equal(onChange.mock.calls[0].arguments[0], 'profile');
});

it('skips disabled tabs and supports vertical, Home, and End keyboard navigation', () => {
    render(
        <Tabs id="settings-tabs" variant="pills" orientation="vertical">
            {tabs}
        </Tabs>
    );
    const home = screen.getByRole('tab', { name: 'Home' });

    assert.equal(screen.getByRole('tablist').getAttribute('aria-orientation'), 'vertical');
    assert.ok(screen.getByRole('tablist').className.includes('nav-pills-vertical'));

    fireEvent.keyDown(home, { key: 'ArrowDown' });

    assert.equal(
        screen.getByRole('tab', { name: 'Profile' }).getAttribute('aria-selected'),
        'true'
    );
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Profile' }), { key: 'End' });

    assert.equal(
        screen.getByRole('tab', { name: 'Contact' }).getAttribute('aria-selected'),
        'true'
    );
    assert.equal(
        (screen.getByRole('tab', { name: 'Disabled' }) as HTMLButtonElement).disabled,
        true
    );
});

it('supports list-group styling, instant panes, and controlled selection', () => {
    const onChange = mock.fn();
    const { rerender } = render(
        <Tabs
            id="controlled-tabs"
            variant="list-group"
            fade={false}
            activeKey="home"
            onChange={onChange}
        >
            {tabs}
        </Tabs>
    );
    const home = screen.getByRole('tab', { name: 'Home' });

    assert.ok(home.className.includes('list-group-item'));
    assert.ok(
        screen.getByRole('tabpanel', { name: 'Home' }).className.includes('tab-pane-instant')
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Contact' }));

    assert.equal(onChange.mock.calls[0].arguments[0], 'contact');
    assert.equal(screen.getByRole('tab', { name: 'Home' }).getAttribute('aria-selected'), 'true');

    rerender(
        <Tabs id="controlled-tabs" variant="list-group" fade={false} activeKey="contact">
            {tabs}
        </Tabs>
    );

    assert.equal(screen.getByRole('tabpanel', { name: 'Contact' }).hidden, false);
});

it('preserves panel props, refs and rich children without leaking tab metadata', () => {
    const ref = createRef<HTMLDivElement>();
    render(
        <Tabs id="composed" defaultActiveKey="second">
            {false}
            {'\n'}
            <Tab eventKey="first" label={<strong>First</strong>}>
                First panel
            </Tab>
            <Tab ref={ref} eventKey="second" label="Second" className="custom" data-example="panel">
                <a href="/details">Details</a>
            </Tab>
            {null}
        </Tabs>
    );
    const panel = screen.getByRole('tabpanel', { name: 'Second' });

    assert.equal(ref.current, panel);
    assert.ok(panel.classList.contains('custom'));
    assert.ok(panel.classList.contains('tab-pane'));
    assert.equal(panel.getAttribute('data-example'), 'panel');
    assert.equal(panel.getAttribute('eventKey'), null);
    assert.equal(panel.getAttribute('label'), null);
    assert.equal(screen.getByRole('link', { name: 'Details' }).getAttribute('href'), '/details');

    fireEvent.click(screen.getByText('First'));

    assert.equal(screen.getByRole('tabpanel', { name: 'First' }).hidden, false);
});

it('updates selection from changing children and falls back when the active tab is removed', () => {
    const { rerender } = render(<Tabs id="dynamic">{tabs}</Tabs>);

    fireEvent.click(screen.getByRole('tab', { name: 'Profile' }));

    assert.equal(screen.getByRole('tabpanel', { name: 'Profile' }).hidden, false);

    rerender(
        <Tabs id="dynamic">
            <Tab eventKey="contact" label="Contact">
                Updated contact
            </Tab>
        </Tabs>
    );

    assert.equal(
        screen.getByRole('tab', { name: 'Contact' }).getAttribute('aria-selected'),
        'true'
    );
    assert.equal(screen.getByRole('tabpanel').textContent, 'Updated contact');
});

it('honors canceled clicks and keyboard events before changing selection', () => {
    const preventDefault = (event: { preventDefault(): void }) => event.preventDefault();
    const changed = mock.fn();
    render(
        <Tabs id="canceled" onChange={changed} onClick={preventDefault} onKeyDown={preventDefault}>
            {tabs}
        </Tabs>
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Profile' }));
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Home' }), { key: 'End' });

    assert.equal(changed.mock.callCount(), 0);
    assert.equal(screen.getByRole('tab', { name: 'Home' }).getAttribute('aria-selected'), 'true');
});

it('handles empty or fully disabled children without activating a panel', () => {
    const { rerender } = render(<Tabs id="empty" />);

    assert.equal(screen.queryAllByRole('tab').length, 0);

    rerender(
        <Tabs id="empty">
            <Tab eventKey="disabled" label="Disabled" disabled>
                Unavailable
            </Tab>
        </Tabs>
    );

    assert.equal(screen.getByRole('tab').getAttribute('aria-selected'), 'false');
    assert.equal(screen.queryByRole('tabpanel'), null);
});

it('reports unsupported children instead of silently omitting content', () => {
    assert.throws(
        () =>
            renderToStaticMarkup(
                <Tabs id="invalid">
                    <div>Not a tab</div>
                </Tabs>
            ),
        /Tabs children must be Tab elements/
    );
});
