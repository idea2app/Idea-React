import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import {
    Card,
    CardBody,
    CardFooter,
    CardGroup,
    CardHeader,
    CardImage,
    CardImageOverlay,
    CardSubtitle,
    CardText,
    CardTitle
} from '../source/Card';

it('renders horizontal, subtle and translucent card variants', () => {
    const { container } = render(
        <Card theme="accent" row body subtle translucent>
            <CardSubtitle>Subtitle</CardSubtitle>
        </Card>
    );

    assert.equal(
        container.firstElementChild?.className,
        'card card-row card-body card-subtle card-translucent theme-accent'
    );
    assert.equal(screen.getByText('Subtitle').className, 'card-subtitle');
});

it('renders every image cap placement and forwards image attributes', () => {
    const { container, rerender } = render(<CardImage src="/image.jpg" alt="Card" />);

    assert.equal(container.querySelector('img')?.className, 'card-img');
    assert.equal(screen.getByAltText('Card').getAttribute('src'), '/image.jpg');

    for (const placement of ['top', 'bottom', 'start', 'end'] as const) {
        rerender(<CardImage placement={placement} alt="Card" />);

        assert.equal(screen.getByAltText('Card').className, `card-img-${placement}`);
    }
});

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
    assert.equal(screen.getByRole('heading', { name: 'Title' }).tagName, 'H4');
    assert.equal(screen.getByText('Body').className, 'card-text');

    const card = screen.getByText('Title').closest('.card');

    assert.equal(card?.className, 'card custom');
    assert.equal(card?.firstElementChild?.className, 'card-body');
});

it('allows card titles to retain the heading level of the surrounding example', () => {
    render(<CardTitle as="h5">Compact title</CardTitle>);

    assert.equal(screen.getByRole('heading', { level: 5 }).className, 'card-title');
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
