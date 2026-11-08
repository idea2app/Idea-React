import { Children, ComponentProps, FC, isValidElement, PropsWithChildren } from 'react';

import { Col, Container, Row } from '../../../../source/Layout/Grid';
import { Navigation } from '../Navigation';
import { documentGroups, Sidebar } from '../Sidebar';
import { Toc } from '../Toc';
import { DocumentHeading } from './Heading';

export interface DocumentLayoutProps extends PropsWithChildren {
    active: string;
    upstreamPath?: string;
}

export const DocumentLayout: FC<DocumentLayoutProps> = ({ active, upstreamPath, children }) => {
    const content = Children.toArray(children);
    const headingIndex = content.findIndex(child => isValidElement(child) && child.type === 'h1');
    const heading = content[headingIndex];
    const itemGroup = documentGroups.find(({ items }) => items.some(({ slug }) => slug === active));
    const group = itemGroup ?? documentGroups.find(({ slug }) => slug === active);
    const path = itemGroup ? `${itemGroup.itemHref}${active}/` : group?.href;
    if (!path) throw new Error(`Unknown documentation page: ${active}`);

    return (
        <Container className="py-4 pb-12 lg:pb-4">
            <Row className="g-5">
                <Col as="aside" lg={3} className="d-none lg:d-block">
                    <Sidebar active={active} />
                </Col>
                <Col xs={12} lg={9}>
                    <Row className="g-5">
                        <Col as="main" id="content" xs={12} lg={9}>
                            {isValidElement<ComponentProps<'h1'>>(heading) && (
                                <DocumentHeading
                                    {...heading.props}
                                    upstreamPath={upstreamPath}
                                    editPath={`document/app/${path}page.mdx`}
                                />
                            )}
                            {content.filter((_, index) => index !== headingIndex)}
                        </Col>
                        <Col as="aside" lg={3} className="d-none lg:d-block">
                            <Toc />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Navigation>
                <Sidebar active={active} />
            </Navigation>
        </Container>
    );
};
