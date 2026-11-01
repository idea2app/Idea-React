import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import {
    Card,
    CardBody,
    CardFooter,
    CardGroup,
    CardHeader,
    CardImageOverlay,
    CardText,
    CardTitle
} from '../source/Card';

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

it('renders Bootstrap 6 card headers and footers', () => {
    render(
        <Card>
            <CardHeader className="custom">Header</CardHeader>
            <CardFooter>Footer</CardFooter>
        </Card>
    );
    assert.equal(screen.getByText('Header').className, 'card-header custom');
    assert.equal(screen.getByText('Footer').className, 'card-footer');
});

it('renders Bootstrap 6 card groups and image overlays', () => {
    render(
        <CardGroup>
            <CardImageOverlay>Overlay content</CardImageOverlay>
        </CardGroup>
    );
    assert.equal(screen.getByText('Overlay content').className, 'card-img-overlay');
    assert.equal(screen.getByText('Overlay content').parentElement?.className, 'card-group');
});
