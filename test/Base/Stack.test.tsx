import assert from 'node:assert/strict';
import { it } from 'node:test';

import { renderToStaticMarkup } from 'react-dom/server';

import { Stack } from '../../source/Base/Stack';

it('renders a vertical stack by default and preserves layout attributes', () => {
    assert.equal(
        renderToStaticMarkup(
            <Stack gap={3} aria-label="Vertical items">
                <span>First</span>
                <span>Second</span>
            </Stack>
        ),
        '<div aria-label="Vertical items" class="vstack gap-3"><span>First</span><span>Second</span></div>'
    );
});

it('supports horizontal layout and polymorphic root elements', () => {
    assert.equal(
        renderToStaticMarkup(
            <Stack as="section" direction="horizontal" gap={2}>
                <span>First</span>
                <span>Second</span>
            </Stack>
        ),
        '<section class="hstack gap-2"><span>First</span><span>Second</span></section>'
    );
});
