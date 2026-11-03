import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { CodeBlock } from '../../source/Extension/CodeBlock';

it('emits both highlight palettes with dynamic inline token colors', () => {
    const code = 'const answer: number = 42;';
    const { container } = render(
        <CodeBlock language="typescript" className="custom" aria-label="Example">
            {code}
        </CodeBlock>
    );
    const block = screen.getByLabelText('Example');
    const tokens = [...container.querySelectorAll<HTMLSpanElement>('span[style]')];

    assert.equal(block.tagName, 'PRE');
    assert.ok(block.classList.contains('custom'));
    assert.equal(block.textContent, code);
    assert.ok(tokens.length > 0);
    assert.ok(tokens.every(token => token.style.getPropertyValue('--shiki-light')));
    assert.ok(tokens.every(token => token.style.getPropertyValue('--shiki-dark')));
    assert.ok(
        tokens.every(token =>
            token
                .getAttribute('style')
                ?.includes('color:light-dark(var(--shiki-light),var(--shiki-dark))')
        )
    );
    assert.ok(
        tokens.some(
            token =>
                token.style.getPropertyValue('--shiki-light') !==
                token.style.getPropertyValue('--shiki-dark')
        )
    );
});

it('preserves React child serialization and escapes code markup', () => {
    const { container, rerender } = render(
        <CodeBlock language="tsx">
            <button type="button">Example</button>
        </CodeBlock>
    );
    assert.match(container.textContent!, /<button type="button">/);
    assert.equal(container.querySelector('button'), null);

    rerender(<CodeBlock language="jsx">{'<script>alert("example")</script>'}</CodeBlock>);

    assert.equal(container.querySelector('script'), null);
    assert.equal(container.textContent, '<script>alert("example")</script>');
});

it('renders an optional code header', () => {
    const { container } = render(
        <CodeBlock language="tsx" header={<a href="https://example.com/source.tsx">source.tsx</a>}>
            const value = 1;
        </CodeBlock>
    );
    assert.equal(
        screen.getByRole('link', { name: 'source.tsx' }).getAttribute('href'),
        'https://example.com/source.tsx'
    );
    assert.equal(container.querySelector('code')?.textContent, 'const value = 1;');
});
