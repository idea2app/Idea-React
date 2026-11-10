import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Fade } from '../../source/Base/Fade';

it('toggles Bootstrap fade classes on its child without adding a wrapper', () => {
    const { rerender, container } = render(
        <Fade className="custom" in>
            <p className="child">Content</p>
        </Fade>
    );
    const content = screen.getByText('Content');

    assert.equal(content.className, 'fade custom child show');
    assert.equal(container.childElementCount, 1);
    assert.equal(content.parentElement, container);

    rerender(
        <Fade>
            <p className="child">Content</p>
        </Fade>
    );
    assert.equal(content.className, 'fade child');
});
