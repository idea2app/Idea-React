import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { PageNav } from '../source/PageNav';

it('builds a scoped table of contents from headings within the root selector', () => {
    render(
        <>
            <h1 id="outside">Outside title</h1>
            <article id="article">
                <h2 id="first">First section</h2>
                <h3 id="detail">Detail</h3>
                <h4 id="deep">Deep heading</h4>
            </article>
            <PageNav rootSelector="#article" minDepth={2} depth={3} aria-label="On this page" />
        </>
    );
    const nav = screen.getByRole('navigation', { name: 'On this page' });
    const links = [...nav.querySelectorAll('a')];

    assert.deepEqual(
        links.map(({ textContent }) => textContent),
        ['First section', 'Detail']
    );
    assert.deepEqual(
        links.map(link => link.getAttribute('href')),
        ['#first', '#detail']
    );
    assert.equal(links[0].style.textIndent, '0rem');
    assert.equal(links[1].style.textIndent, '1rem');
});

it('collects document-wide headings and assigns missing ids by default', () => {
    render(
        <>
            <h2>Anonymous section</h2>
            <PageNav aria-label="Full outline" />
        </>
    );
    const nav = screen.getByRole('navigation', { name: 'Full outline' });
    const links = [...nav.querySelectorAll('a')];

    assert.ok(links.length >= 1);

    for (const link of links) assert.match(link.getAttribute('href')!, /^#.+/);
});
