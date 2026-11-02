import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { CodeBlock } from '../../source/Extension/CodeBlock';

it('emits both highlight palettes without a fixed inline token color', () => {
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
    assert.ok(tokens.every(token => !token.style.color));
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
