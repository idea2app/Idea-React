import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import {
    Breadcrumb,
    BreadcrumbDivider,
    BreadcrumbItem,
    BreadcrumbLink
} from '../source/Breadcrumb';

it('renders semantic breadcrumb items with default and custom decorative dividers', () => {
    const { container } = render(
        <nav aria-label="Breadcrumb">
            <Breadcrumb className="custom">
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbDivider />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbDivider>/</BreadcrumbDivider>
                <BreadcrumbItem aria-current="page">
                    <BreadcrumbLink href="/docs/data" active>
                        Data
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </nav>
    );
    assert.equal(screen.getByRole('list').className, 'breadcrumb custom');
    assert.equal(screen.getByRole('link', { name: 'Data' }).getAttribute('aria-current'), 'page');
    assert.equal(screen.getByRole('link', { name: 'Data' }).className, 'breadcrumb-link active');
    assert.equal(screen.getAllByRole('listitem').length, 3);
    assert.equal(container.querySelectorAll('[aria-hidden="true"]').length, 2);
    assert.equal(container.querySelector('.breadcrumb-divider')?.textContent, '');
});
