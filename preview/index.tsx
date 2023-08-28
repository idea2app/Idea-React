import { configure, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent, ReactNode } from 'react';
import {
    Button,
    Col,
    Container,
    Form,
    Image,
    Modal,
    Row
} from 'react-bootstrap';
import { render } from 'react-dom';
import { formToJSON, sleep } from 'web-utility';

import {
    Avatar,
    CodeBlock,
    Dialog,
    DialogClose,
    Icon,
    Loading,
    MonthCalendar,
    Nameplate,
    Option,
    OverlayBox,
    PageNav,
    Select,
    SpinnerButton,
    TimeDistance
} from '../source';
import { Section } from './utility';

configure({ enforceActions: 'never' });

@observer
export class App extends PureComponent {
    constructor(props: {}) {
        super(props);
        makeObservable(this);
    }

    @observable
    pageIndex = 1;

    @observable
    selectValue = '0';

    @observable
    showLoading = false;

    renderCode(code: ReactNode) {
        return (
            <>
                {code}
                <CodeBlock language="tsx">{code}</CodeBlock>
            </>
        );
    }

    inputDialog = new Dialog<Record<'a' | 'b', number>>(({ defer }) => (
        <Modal show={!!defer} onHide={() => defer?.reject(new DialogClose())}>
            <Modal.Header>Dialog</Modal.Header>
            <Modal.Body>
                <Form
                    id="input-dialog"
                    onSubmit={event => {
                        event.preventDefault();

                        defer?.resolve(formToJSON(event.currentTarget));
                    }}
                    onReset={() => defer?.reject(new DialogClose())}
                >
                    <Form.Group>
                        <Form.Label>A</Form.Label>
                        <Form.Control type="number" name="a" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>B</Form.Label>
                        <Form.Control type="number" name="b" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-end gap-3">
                <Button form="input-dialog" type="submit">
                    √
                </Button>
                <Button form="input-dialog" type="reset" variant="danger">
                    ×
                </Button>
            </Modal.Footer>
        </Modal>
    ));

    someLogic = async () => {
        try {
            const data = await this.inputDialog.open();

            alert(JSON.stringify(data, null, 4));
        } catch (error) {
            if (error instanceof DialogClose) console.warn(error.message);
        }
    };

    renderContent() {
        const { selectValue, showLoading } = this;

        return (
            <>
                <h1 id="top">Idea React components</h1>

                <Section title="Time Distance">
                    {this.renderCode(<TimeDistance date="1989-06-04" />)}
                </Section>

                <Section title="Icon">
                    {this.renderCode(
                        <Icon name="trash" size={2} className="text-danger" />
                    )}
                </Section>

                <Section title="Avatar">
                    {this.renderCode(
                        <Avatar src="https://github.com/idea2app.png" />
                    )}
                </Section>

                <Section title="Nameplate">
                    {this.renderCode(
                        <Nameplate
                            name="idea2app"
                            avatar="https://github.com/idea2app.png"
                        />
                    )}
                </Section>

                <Section title="Spinner Button">
                    {this.renderCode(
                        <>
                            <SpinnerButton
                                className="me-3"
                                animation="border"
                                loading
                            />
                            <SpinnerButton
                                animation="grow"
                                type="submit"
                                loading
                            >
                                Submit
                            </SpinnerButton>
                        </>
                    )}
                </Section>

                <Section title="Select">
                    {this.renderCode(
                        <Select
                            value={selectValue}
                            onChange={value => (this.selectValue = value)}
                        >
                            <Option value="0">
                                <Icon className="me-2" name="heart" />
                                idea2app
                            </Option>
                            <Option value="1">
                                <Icon className="me-2" name="bootstrap" />
                                freeCodeCamp
                            </Option>
                        </Select>
                    )}
                </Section>

                <Section title="Month Calendar">
                    {this.renderCode(
                        <MonthCalendar
                            value={[{ date: new Date(), content: 'Hello!' }]}
                            onChange={console.log}
                        />
                    )}
                </Section>

                <Section title="IdeaDialog">
                    {this.renderCode(
                        <>
                            <Button onClick={this.someLogic}>显示弹窗</Button>

                            <this.inputDialog.Component />
                        </>
                    )}
                </Section>

                <Section title="Overlay Box">
                    {this.renderCode(
                        <OverlayBox
                            trigger="click"
                            title="view info"
                            detail={
                                <Image src="https://github.com/idea2app.png" />
                            }
                        >
                            <Button>查看</Button>
                        </OverlayBox>
                    )}
                </Section>

                <Section title="Page Nav">
                    <CodeBlock language="tsx">
                        <PageNav />
                    </CodeBlock>
                </Section>

                <Section title="Loading">
                    {this.renderCode(
                        <>
                            <Button
                                onClick={async () => {
                                    this.showLoading = true;
                                    await sleep(1);
                                    this.showLoading = false;
                                }}
                                style={{ zIndex: '1040' }}
                            >
                                显示
                            </Button>
                            {showLoading && <Loading>加载中...</Loading>}
                        </>
                    )}
                </Section>
            </>
        );
    }

    render() {
        return (
            <div className="bg-light">
                <Container className="py-5" fluid="md">
                    <Row>
                        <Col xs={12} sm={3}>
                            <PageNav className="sticky-top" />
                        </Col>
                        <Col xs={12} sm={9}>
                            {this.renderContent()}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

render(<App />, document.querySelector('#app'));
