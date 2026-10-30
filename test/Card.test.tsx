import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Card, CardBody, CardText, CardTitle } from '../source/Card';

it('renders official Bootstrap 6 card parts', () => {
    render(
        <Card className="custom">
            <CardBody>
                <CardTitle>Title</CardTitle>
                <CardText>Body</CardText>
            </CardBody>
        </Card>
    );

    assert.equal(screen.getByText('Title').className, 'card-title');
    assert.equal(screen.getByText('Body').className, 'card-text');

    const card = screen.getByText('Title').closest('.card');

    assert.equal(card?.className, 'card custom');
    assert.equal(card?.firstElementChild?.className, 'card-body');
});
