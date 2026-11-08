import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Chip, ChipDismiss, ChipIcon, ChipImage, ChipToken } from '../source/Form/Chip';

it('server-renders static chip components without mounting the form plugin', () => {
    const markup = renderToStaticMarkup(
        <Chip theme="primary" active>
            Static
        </Chip>
    );

    assert.match(markup, /class="chip active theme-primary"/);
    assert.match(markup, />Static<\/button>/);
});

it('preserves anchor semantics and explicit native button types', () => {
    render(
        <>
            <Chip as="a" href="https://getbootstrap.com/docs/6.0/">
                Bootstrap
            </Chip>
            <Chip type="submit">Submit</Chip>
        </>
    );

    assert.equal(screen.getByRole('link', { name: 'Bootstrap' }).hasAttribute('type'), false);
    assert.equal(screen.getByRole('button', { name: 'Submit' }).getAttribute('type'), 'submit');
});

it('composes avatar, icon and dismissible token shapes without nested buttons', () => {
    render(
        <ChipToken theme="success" active>
            <ChipImage src="avatar.png" alt="Profile" />
            <ChipIcon name="person" aria-hidden="true" />
            Person
            <ChipDismiss disabled />
        </ChipToken>
    );

    assert.equal(screen.getByRole('img').className, 'chip-img');
    assert.equal(screen.getByRole('button', { name: 'Remove' }).parentElement?.tagName, 'SPAN');
    assert.equal(screen.getByRole('button', { name: 'Remove' }).hasAttribute('disabled'), true);
});
