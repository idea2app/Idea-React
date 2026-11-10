import { Button } from '../../../../source/Base/Button';
import { CloseButton } from '../../../../source/Base/CloseButton';
import { Icon } from '../../../../source/Extension/Icon';
import { Col, Container } from '../../../../source/Layout/Grid';
import { BaseLayout } from '../../../component/Document/BaseLayout';
import styles from './style.module.less';

export default function JumbotronsPage() {
    return (
        <BaseLayout title="Jumbotrons">
            <Container className="my-5">
                <div className="p-5 text-center bg-1 rounded-3">
                    <Icon name="bootstrap" size={6.25} className="mt-4 mb-3" />
                    <h1 className="fg-emphasis-inverse">Jumbotron with icon</h1>
                    <Col as="p" lg={8} className="mx-auto fs-lg fg-secondary">
                        <>
                            This is a custom jumbotron featuring an SVG image at the top, some
                            longer text that wraps early thanks to a responsive <code>.col-*</code>{' '}
                            class, and a customized call to action.
                        </>
                    </Col>
                    <div className="d-inline-flex gap-2 mb-5">
                        <Button
                            variant="solid"
                            theme="primary"
                            size="lg"
                            className="ps-4 pe-3 rounded-pill"
                        >
                            Call to action
                            <Icon name="arrow-right-short" size={1.5} />
                        </Button>
                        <Button
                            variant="outline"
                            theme="secondary"
                            size="lg"
                            className="px-4 rounded-pill"
                        >
                            Secondary link
                        </Button>
                    </div>
                </div>
            </Container>

            <div className="b-example-divider" />

            <Container className="my-5">
                <div
                    className={`position-relative p-5 text-center fg-secondary bg-body border ${styles['border-dashed']} rounded-5`}
                >
                    <CloseButton
                        className="position-absolute top-0 end-0 p-3 m-3 bg-secondary rounded-pill"
                        aria-label="Close"
                    />
                    <Icon name="check2-circle" size={3} className="mt-5 mb-3" />
                    <h1 className="fg-emphasis-inverse">Placeholder jumbotron</h1>
                    <Col as="p" lg={6} className="mx-auto mb-4">
                        {`This faded back jumbotron is useful for placeholder content. It's also a great way to
            add a bit of context to a page or section when no content is available and to encourage
            visitors to take a specific action.`}
                    </Col>
                    <Button variant="solid" theme="primary" className="px-4 mb-5">
                        Call to action
                    </Button>
                </div>
            </Container>

            <div className="b-example-divider" />

            <div className="my-5">
                <div className="p-5 text-center bg-1">
                    <Container className="py-5">
                        <h1 className="fg-emphasis-inverse">Full-width jumbotron</h1>
                        <Col as="p" lg={8} className="mx-auto fs-lg fw-light">
                            <>
                                This takes the basic jumbotron above and makes its background
                                edge-to-edge with a <code>.container</code> inside to align content.
                                Similar to above, it's been recreated with built-in grid and utility
                                classes.
                            </>
                        </Col>
                    </Container>
                </div>
            </div>

            <div className="b-example-divider" />

            <Container className="my-5">
                <div className="p-5 text-center bg-1 rounded-3">
                    <h1 className="fg-emphasis-inverse">Basic jumbotron</h1>
                    <p className="fs-lg fw-light">
                        This is a simple Bootstrap jumbotron that sits within a{' '}
                        <code>.container</code>, recreated with built-in utility classes.
                    </p>
                </div>
            </Container>

            <div className="b-example-divider" />
        </BaseLayout>
    );
}
