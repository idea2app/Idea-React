import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import { PageItem, PageLink, PageText, Pagination } from '../source/Pagination';

it('supports themes, sizes, active pages, disabled links and noninteractive page text', () => {
    const onClick = mock.fn();
    const { rerender } = render(
        <Pagination theme="accent" size="lg" className="justify-content-center">
            <PageItem disabled>
                <PageLink href="/previous" onClick={onClick}>
                    Previous
                </PageLink>
            </PageItem>
            <PageItem active>
                <PageLink href="/1">1</PageLink>
            </PageItem>
            <PageItem>
                <PageText>...</PageText>
            </PageItem>
        </Pagination>
    );

    assert.equal(
        screen.getByRole('list').className,
        'pagination theme-accent pagination-lg justify-content-center'
    );
    assert.equal(screen.getByRole('link', { name: '1' }).getAttribute('aria-current'), 'page');
    const disabled = screen.getByText('Previous');
    assert.equal(disabled.getAttribute('href'), null);
    assert.equal(disabled.getAttribute('tabindex'), '-1');
    assert.equal(disabled.getAttribute('aria-disabled'), 'true');
    assert.equal(disabled.parentElement?.className, 'page-item disabled');
    assert.equal(screen.getByText('...').className, 'page-link');

    fireEvent.click(disabled);

    assert.equal(onClick.mock.callCount(), 0);

    rerender(
        <Pagination size="sm">
            <PageItem>
                <PageLink href="/2" onClick={onClick}>
                    2
                </PageLink>
            </PageItem>
        </Pagination>
    );
    fireEvent.click(screen.getByRole('link', { name: '2' }));

    assert.equal(onClick.mock.callCount(), 1);
    assert.equal(screen.getByRole('list').className, 'pagination pagination-sm');
});
