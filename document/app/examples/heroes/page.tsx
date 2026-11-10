import { Button } from '../../../../source/Base/Button';
import { FormCheck, FormControl, FormField, FormFloatingLabel } from '../../../../source/Form';
import { Col, Container, Row } from '../../../../source/Layout/Grid';
import { BaseLayout } from '../../../component/Document/BaseLayout';
import styles from './style.module.less';

export default function HeroesPage() {
    return (
        <BaseLayout title="Heroes">
            <div>
                <h1 className="visually-hidden">Heroes examples</h1>

                <div className="px-4 py-5 my-5 text-center">
                    <img
                        className="d-block mx-auto mb-4"
                        src="https://getbootstrap.com/docs/6.0/assets/brand/bootstrap-logo.svg"
                        alt=""
                        width="72"
                        height="57"
                    />
                    <h1 className="fs-4xl fw-bold fg-emphasis-inverse">Centered hero</h1>
                    <Col lg={6} className="mx-auto">
                        <p className="fs-lg fw-light mb-4">
                            Quickly design and customize responsive mobile-first sites with
                            Bootstrap, the world’s most popular front-end open source toolkit,
                            featuring Sass variables and mixins, responsive grid system, extensive
                            prebuilt components, and powerful JavaScript plugins.
                        </p>
                        <div className="d-grid gap-2 sm:d-flex sm:justify-content-center">
                            <Button variant="solid" theme="primary" size="lg" className="px-4">
                                Primary button
                            </Button>
                            <Button variant="outline" theme="secondary" size="lg" className="px-4">
                                Secondary
                            </Button>
                        </div>
                    </Col>
                </div>

                <div className="b-example-divider" />

                <div className="px-4 pt-5 my-5 text-center border-bottom">
                    <h1 className="fs-5xl fw-bold fg-emphasis-inverse">Centered screenshot</h1>
                    <Col lg={6} className="mx-auto">
                        <p className="fs-lg fw-light mb-4">
                            Quickly design and customize responsive mobile-first sites with
                            Bootstrap, the world’s most popular front-end open source toolkit,
                            featuring Sass variables and mixins, responsive grid system, extensive
                            prebuilt components, and powerful JavaScript plugins.
                        </p>
                        <div className="d-grid gap-2 sm:d-flex sm:justify-content-center mb-5">
                            <Button
                                variant="solid"
                                theme="primary"
                                size="lg"
                                className="px-4 sm:me-3"
                            >
                                Primary button
                            </Button>
                            <Button variant="outline" theme="secondary" size="lg" className="px-4">
                                Secondary
                            </Button>
                        </div>
                    </Col>
                    <div className={`${styles['hero-preview']} overflow-hidden`}>
                        <Container className="px-5">
                            <img
                                src="https://raw.githubusercontent.com/twbs/bootstrap/main/site/src/assets/examples/heroes/bootstrap-docs.png"
                                className="img-fluid border rounded-3 shadow-lg mb-4"
                                alt="Bootstrap documentation preview"
                                width="700"
                                height="500"
                                loading="lazy"
                            />
                        </Container>
                    </div>
                </div>

                <div className="b-example-divider" />

                <Container as={Col} {...{ '2xl': 8 }} className="px-4 py-5">
                    <Row className="lg:flex-row-reverse align-items-center g-5 py-5">
                        <Col xs={10} sm={8} lg={6}>
                            <img
                                src="https://raw.githubusercontent.com/twbs/bootstrap/main/site/src/assets/examples/heroes/bootstrap-themes.png"
                                className="d-block lg:mx-auto img-fluid"
                                alt="Bootstrap Themes"
                                width="700"
                                height="500"
                                loading="lazy"
                            />
                        </Col>
                        <Col lg={6}>
                            <h1 className="fs-4xl fw-bold fg-emphasis-inverse lh-1 mb-3">
                                Responsive left-aligned hero with image
                            </h1>
                            <p className="fs-lg fw-light">
                                Quickly design and customize responsive mobile-first sites with
                                Bootstrap, the world’s most popular front-end open source toolkit,
                                featuring Sass variables and mixins, responsive grid system,
                                extensive prebuilt components, and powerful JavaScript plugins.
                            </p>
                            <div className="d-grid gap-2 md:d-flex md:justify-content-start">
                                <Button
                                    variant="solid"
                                    theme="primary"
                                    size="lg"
                                    className="px-4 md:me-2"
                                >
                                    Primary
                                </Button>
                                <Button
                                    variant="outline"
                                    theme="secondary"
                                    size="lg"
                                    className="px-4"
                                >
                                    Default
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <div className="b-example-divider" />

                <Container as={Col} xl={10} {...{ '2xl': 8 }} className="px-4 py-5">
                    <Row className="align-items-center lg:g-5 py-5">
                        <Col lg={7} className="text-center lg:text-start">
                            <h1 className="fs-5xl fw-bold lh-1 fg-emphasis-inverse mb-3">
                                Vertically centered hero sign-up form
                            </h1>
                            <Col as="p" lg={10} className="fs-xl">
                                {`Below is an example form built entirely with Bootstrap’s form controls. Each
                required form group has a validation state that can be triggered by attempting to
                submit the form without completing it.`}
                            </Col>
                        </Col>
                        <Col md={10} lg={5} className="mx-auto">
                            <form className="p-4 md:p-5 border rounded-3 bg-1">
                                <FormFloatingLabel className="mb-3">
                                    <label htmlFor="floatingInput">Email address</label>
                                    <FormControl
                                        type="email"
                                        id="floatingInput"
                                        placeholder="name@example.com"
                                    />
                                </FormFloatingLabel>
                                <FormFloatingLabel className="mb-3">
                                    <label htmlFor="floatingPassword">Password</label>
                                    <FormControl
                                        type="password"
                                        id="floatingPassword"
                                        placeholder="Password"
                                    />
                                </FormFloatingLabel>
                                <FormField className="mb-3">
                                    <FormCheck
                                        type="checkbox"
                                        value="remember-me"
                                        id="heroRememberMe"
                                    />
                                    <label htmlFor="heroRememberMe">Remember me</label>
                                </FormField>
                                <Button
                                    variant="solid"
                                    theme="primary"
                                    size="lg"
                                    className="w-100"
                                    type="submit"
                                >
                                    Sign up
                                </Button>
                                <hr className="my-4" />
                                <small className="fg-2">
                                    By clicking Sign up, you agree to the terms of use.
                                </small>
                            </form>
                        </Col>
                    </Row>
                </Container>

                <div className="b-example-divider" />

                <Container className="my-5">
                    <Row className="p-4 pb-0 lg:pe-0 lg:pt-5 align-items-center rounded-3 border shadow-lg">
                        <Col lg={7} className="p-3 lg:p-5 lg:pt-3">
                            <h1 className="fs-5xl fw-bold lh-1 fg-emphasis-inverse">
                                Border hero with cropped image and shadows
                            </h1>
                            <p className="fs-lg fw-light">
                                Quickly design and customize responsive mobile-first sites with
                                Bootstrap, the world’s most popular front-end open source toolkit,
                                featuring Sass variables and mixins, responsive grid system,
                                extensive prebuilt components, and powerful JavaScript plugins.
                            </p>
                            <div className="d-grid gap-2 md:d-flex md:justify-content-start mb-4 lg:mb-3">
                                <Button
                                    variant="solid"
                                    theme="primary"
                                    size="lg"
                                    className="px-4 md:me-2"
                                >
                                    Primary
                                </Button>
                                <Button
                                    variant="outline"
                                    theme="secondary"
                                    size="lg"
                                    className="px-4"
                                >
                                    Default
                                </Button>
                            </div>
                        </Col>
                        <Col lg={{ span: 4, offset: 1 }} className="p-0 overflow-hidden shadow-lg">
                            <img
                                className={styles['rounded-lg-3']}
                                src="https://raw.githubusercontent.com/twbs/bootstrap/main/site/src/assets/examples/heroes/bootstrap-docs.png"
                                alt=""
                                width="720"
                            />
                        </Col>
                    </Row>
                </Container>

                <div className="b-example-divider" />

                <div className="bg-black fg-secondary px-4 py-5 text-center" data-bs-theme="dark">
                    <div className="py-5">
                        <h1 className="fs-4xl fw-bold fg-white">Dark color hero</h1>
                        <Col lg={6} className="mx-auto">
                            <p className="mb-4">
                                Quickly design and customize responsive mobile-first sites with
                                Bootstrap, the world’s most popular front-end open source toolkit,
                                featuring Sass variables and mixins, responsive grid system,
                                extensive prebuilt components, and powerful JavaScript plugins.
                            </p>
                            <div className="d-grid gap-2 sm:d-flex sm:justify-content-center">
                                <Button
                                    variant="outline"
                                    theme="info"
                                    size="lg"
                                    className="px-4 sm:me-3"
                                >
                                    Custom button
                                </Button>
                                <Button
                                    variant="outline"
                                    theme="secondary"
                                    size="lg"
                                    className="px-4"
                                >
                                    Secondary
                                </Button>
                            </div>
                        </Col>
                    </div>
                </div>

                <div className="b-example-divider mb-0" />
            </div>
        </BaseLayout>
    );
}
