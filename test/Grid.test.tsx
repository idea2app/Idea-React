import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render } from '@testing-library/react';

import { Col, Container, Row } from '../source/Grid';

it('uses Bootstrap 6 container, row, and responsive column classes', () => {
    const { container, rerender } = render(
        <Container className="custom" fluid>
            <Row>
                <Col>Auto</Col>
                <Col span={12} lg={7}>
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

    rerender(<Container breakpoint="lg" />);

    assert.equal((container.firstElementChild as HTMLElement).className, 'lg:container');
});
