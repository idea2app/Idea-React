import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Tab, TabItem } from '../source/Tab';

const tabs: TabItem[] = [
    { key: 'home', label: 'Home', content: 'Home panel' },
    { key: 'profile', label: 'Profile', content: 'Profile panel' },
    { key: 'disabled', label: 'Disabled', content: 'Disabled panel', disabled: true },
    { key: 'contact', label: 'Contact', content: 'Contact panel' }
];

it('renders tab semantics safely during server-side rendering', () => {
    const markup = renderToStaticMarkup(<Tab id="server-tabs" tabs={tabs} />);

    assert.match(markup, /role="tablist"/);
    assert.match(markup, /role="tabpanel"/);
});

it('activates tabs with clicks and keyboard while maintaining the tab-panel relationship', () => {
    const onChange = mock.fn();
    render(<Tab id="account-tabs" tabs={tabs} onChange={onChange} />);

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
    render(<Tab id="settings-tabs" tabs={tabs} variant="pills" orientation="vertical" />);
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
        <Tab
            id="controlled-tabs"
            tabs={tabs}
            variant="list-group"
            fade={false}
            activeKey="home"
            onChange={onChange}
        />
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
        <Tab
            id="controlled-tabs"
            tabs={tabs}
            variant="list-group"
            fade={false}
            activeKey="contact"
        />
    );

    assert.equal(screen.getByRole('tabpanel', { name: 'Contact' }).hidden, false);
});
