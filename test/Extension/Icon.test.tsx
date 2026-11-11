import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render } from '@testing-library/react';

import { Icon } from '../../source/Extension/Icon';

it('hides decorative icons from assistive technology by default', () => {
    const { container } = render(<Icon name="star" />);

    assert.equal(container.firstElementChild?.getAttribute('aria-hidden'), 'true');
});

it('exposes labeled icons and preserves an explicit aria-hidden value', () => {
    const { container } = render(
        <>
            <Icon name="star" aria-label="Favorite" role="img" />
            <Icon name="star" aria-hidden={false} />
            <Icon name="star" aria-labelledby="favorite-label" />
        </>
    );
    const [labeledIcon, visibleIcon, referencedIcon] = [...container.children];

    assert.equal(labeledIcon.getAttribute('aria-hidden'), null);
    assert.equal(labeledIcon.getAttribute('aria-label'), 'Favorite');
    assert.equal(visibleIcon.getAttribute('aria-hidden'), 'false');
    assert.equal(referencedIcon.getAttribute('aria-hidden'), null);
});
