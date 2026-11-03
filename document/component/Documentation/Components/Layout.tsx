import { FC, PropsWithChildren } from 'react';

import { Col, Container, Row } from '../../../../source/Grid';
import { Navigation } from './Navigation';
import { Sidebar } from './Sidebar';
import { Toc } from './Toc';

export interface ComponentsLayoutProps extends PropsWithChildren {
    active?: string;
}

export const DocumentationLayout: FC<ComponentsLayoutProps> = ({ active, children }) => (
    <Container className="py-4 pb-12 lg:pb-4">
        <Row className="g-5">
            <aside className="lg:col-3 d-none lg:d-block">
                <Sidebar active={active} />
            </aside>
            <Col span={12} lg={9}>
                <Row className="g-5">
                    <main id="content" className="col-12 lg:col-9">
                        {children}
                    </main>
                    <aside className="lg:col-3 d-none lg:d-block">
                        <Toc />
                    </aside>
                </Row>
            </Col>
        </Row>

        <Navigation>
            <Sidebar active={active} />
        </Navigation>
    </Container>
);

export const ComponentsLayout = DocumentationLayout;
