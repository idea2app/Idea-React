import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MarkdownView } from '../../source/Extension/MarkdownView';

it('synchronously renders Markdown with the GitHub styling class on the server', () => {
    const markup = renderToStaticMarkup(
        <MarkdownView className="custom">{'## Title\n\n**Strong** and `code`.'}</MarkdownView>
    );

    assert.match(markup, /^<article class="markdown-body custom">/);
    assert.match(markup, /<h2>Title<\/h2>/);
    assert.match(markup, /<strong>Strong<\/strong> and <code>code<\/code>/);
    assert.doesNotMatch(markup, /data=|children=/);
});

it('updates Markdown immediately and forwards article props and refs', () => {
    const ref = createRef<HTMLElement>();
    const { rerender } = render(
        <MarkdownView ref={ref} aria-label="Readme" id="readme">
            # Initial
        </MarkdownView>
    );
    const article = screen.getByRole('article', { name: 'Readme' });

    assert.equal(ref.current, article);
    assert.equal(article.id, 'readme');
    assert.equal(screen.getByRole('heading', { level: 1 }).textContent, 'Initial');

    rerender(
        <MarkdownView ref={ref} aria-label="Readme">
            {'- Next\n- Last'}
        </MarkdownView>
    );

    assert.equal(screen.queryByRole('heading'), null);
    assert.deepEqual(
        screen.getAllByRole('listitem').map(({ textContent }) => textContent),
        ['Next', 'Last']
    );
});

it('preserves a custom root and renders trusted HTML without sanitizing', () => {
    const ref = createRef<HTMLDivElement>();
    render(
        <MarkdownView ref={ref} as="div" data-testid="markdown">
            {'<em data-trusted="yes">Trusted HTML</em>'}
        </MarkdownView>
    );

    assert.equal(ref.current, screen.getByTestId('markdown'));
    assert.equal(ref.current?.querySelector('em')?.dataset.trusted, 'yes');
});

it('supports empty Markdown without producing placeholder content', () => {
    const markdown = '';
    const markup = renderToStaticMarkup(<MarkdownView>{markdown}</MarkdownView>);

    assert.equal(markup, '<article class="markdown-body"></article>');
});
