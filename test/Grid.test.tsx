import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render } from '@testing-library/react';

import { Col, Container, Row } from '../source/Layout/Grid';

it('preserves component names in serialized documentation examples', () => {
    assert.equal(Container.displayName, 'Container');
    assert.equal(Row.displayName, 'Row');
    assert.equal(Col.displayName, 'Col');
});

it('renders an equal-width column from a breakpoint', () => {
    const { container } = render(
        <Row>
            <Col sm>Equal</Col>
        </Row>
    );
    assert.equal(container.querySelector('.row > div')?.className, 'sm:col');
});

it('uses xs to set base column widths', () => {
    const { container } = render(
        <Row>
            <Col xs>Equal</Col>
            <Col xs="auto">Natural</Col>
        </Row>
    );
    assert.deepEqual(
        [...container.querySelectorAll('.row > div')].map(column => column.className),
        ['col', 'col-auto']
    );
});

it('supports responsive column spans, offsets, and ordering', () => {
    const { container } = render(
        <Row>
            <Col
                xs={{ span: 6, order: 'last' }}
                sm={{ offset: 2, order: 'first' }}
                md={{ span: 'auto', offset: 1, order: 3 }}
                lg={{ span: true }}
                xl={{ span: 5 }}
                {...{ '2xl': { span: 4, offset: 0, order: 0 } }}
            >
                Responsive
            </Col>
        </Row>
    );

    assert.equal(
        container.querySelector('.row > div')?.className,
        'col-6 order-last sm:offset-2 sm:order-first md:col-auto md:offset-1 md:order-3 lg:col xl:col-5 2xl:col-4 2xl:offset-0 2xl:order-0'
    );
});

it('keeps auto-layout columns when only offset or order is specified', () => {
    const { container } = render(
        <Row>
            <Col md={{ offset: 2 }} />
            <Col lg={{ order: 'first' }} />
        </Row>
    );

    assert.deepEqual(
        [...container.querySelectorAll('.row > div')].map(column => column.className),
        ['col md:offset-2', 'col lg:order-first']
    );
});

it('uses Bootstrap 6 container, row, and responsive column classes', () => {
    const { container, rerender } = render(
        <Container className="custom" fluid>
            <Row>
                <Col>Auto</Col>
                <Col xs={12} lg={7}>
                    Main
                </Col>
            </Row>
        </Container>
    );
    const root = container.firstElementChild as HTMLElement;

    assert.equal(root.className, 'container-fluid custom');
    assert.equal(root.firstElementChild?.className, 'row');
    assert.deepEqual(
        [...root.querySelectorAll('.row > div')].map(column => column.className),
        ['col', 'col-12 lg:col-7']
    );
    rerender(<Container fluid="lg" />);

    assert.equal((container.firstElementChild as HTMLElement).className, 'lg:container');

    rerender(<Container fluid={false} />);

    assert.equal((container.firstElementChild as HTMLElement).className, 'container');
});

it('sets row columns from xs and breakpoint props', () => {
    const { container } = render(
        <Row xs={1} sm={2} md="auto" className="g-4">
            <Col>One</Col>
        </Row>
    );
    assert.equal(
        container.firstElementChild?.className,
        'row row-cols-1 sm:row-cols-2 md:row-cols-auto g-4'
    );
});
