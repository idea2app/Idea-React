import './style.less';

import {
    Breadcrumb,
    BreadcrumbDivider,
    BreadcrumbItem,
    BreadcrumbLink
} from '../../../../source/Base/Breadcrumb';
import { Icon } from '../../../../source/Extension/Icon';
import { Container } from '../../../../source/Layout/Grid';
import { BaseLayout } from '../../../component/Document/BaseLayout';

export default function BreadcrumbsPage() {
    return (
        <BaseLayout title="Breadcrumbs">
            <Container className="my-5">
                <nav aria-label="breadcrumb">
                    <Breadcrumb className="p-3 bg-1 rounded-3">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDivider />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">Library</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDivider />
                        <BreadcrumbItem active>
                            <BreadcrumbLink href="#">Data</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </nav>
            </Container>

            <div className="b-example-divider" />

            <Container className="my-5">
                <nav aria-label="breadcrumb">
                    <Breadcrumb className="p-3 bg-1 rounded-3">
                        <BreadcrumbItem>
                            <BreadcrumbLink className="theme-inverse" href="#">
                                <Icon name="house-door-fill" />
                                <span className="visually-hidden">Home</span>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDivider />
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                className="theme-inverse fw-semibold text-decoration-none"
                                href="#"
                            >
                                Library
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDivider />
                        <BreadcrumbItem active>
                            <BreadcrumbLink href="#">Data</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </nav>
            </Container>

            <div className="b-example-divider" />

            <Container className="my-5">
                <nav aria-label="breadcrumb">
                    <Breadcrumb className="p-3 bg-1 rounded-3">
                        <BreadcrumbItem>
                            <BreadcrumbLink className="theme-inverse" href="#">
                                <Icon name="house-door-fill" />
                                <span className="visually-hidden">Home</span>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDivider>
                            <Icon name="chevron-right" />
                        </BreadcrumbDivider>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                className="theme-inverse fw-semibold text-decoration-none"
                                href="#"
                            >
                                Library
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDivider>
                            <Icon name="chevron-right" />
                        </BreadcrumbDivider>
                        <BreadcrumbItem active>
                            <BreadcrumbLink href="#">Data</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </nav>
            </Container>

            <div className="b-example-divider" />

            <Container className="my-5">
                <nav aria-label="breadcrumb">
                    <Breadcrumb className="breadcrumb-custom overflow-hidden text-center bg-1 border rounded-3">
                        <BreadcrumbItem>
                            <a className="theme-inverse fw-semibold text-decoration-none" href="#">
                                <Icon name="house-door-fill" />
                                Home
                            </a>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <a className="theme-inverse fw-semibold text-decoration-none" href="#">
                                Library
                            </a>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>Data</BreadcrumbItem>
                    </Breadcrumb>
                </nav>
            </Container>

            <div className="b-example-divider" />
        </BaseLayout>
    );
}
