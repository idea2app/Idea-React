import { FC, PropsWithChildren } from 'react';

import { Col, Container, Row } from '../../../source/Layout/Grid';
import { DocumentNavigation } from './Navigation';
import { DocumentSidebar } from './Sidebar';
import { DocumentToc } from './Toc';

export interface DocumentLayoutProps extends PropsWithChildren {
    active?: string;
}

export const DocumentLayout: FC<DocumentLayoutProps> = ({ active, children }) => (
    <Container className="py-4 pb-12 lg:pb-4">
        <Row className="g-5">
            <aside className="lg:col-3 d-none lg:d-block">
                <DocumentSidebar active={active} />
            </aside>
            <Col xs={12} lg={9}>
                <Row className="g-5">
                    <main id="content" className="col-12 lg:col-9">
                        {children}
                    </main>
                    <aside className="lg:col-3 d-none lg:d-block">
                        <DocumentToc />
                    </aside>
                </Row>
            </Col>
        </Row>

        <DocumentNavigation>
            <DocumentSidebar active={active} />
        </DocumentNavigation>
    </Container>
);
