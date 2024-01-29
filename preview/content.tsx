import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Button, Form, Image, Modal } from 'react-bootstrap';
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
    TimeDistance,
    TypeEcho
} from '../source';
import { CodeExample, Section } from './utility';

@observer
export class Content extends PureComponent {
    @observable
    accessor pageIndex = 1;

    @observable
    accessor selectValue = '0';

    @observable
    accessor showLoading = false;

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

    render() {
        const { selectValue, showLoading } = this;

        return (
            <>
                <h1 id="top">Idea React components</h1>

                <Section title="TypeEcho">
                    <CodeExample>
                        <TypeEcho text="Hello, Idea React!" />
                    </CodeExample>
                </Section>

                <Section title="Time Distance">
                    <CodeExample>
                        <TimeDistance date="1989-06-04" />
                    </CodeExample>
                </Section>

                <Section title="Icon">
                    <CodeExample>
                        <Icon name="trash" size={2} className="text-danger" />
                    </CodeExample>
                </Section>

                <Section title="Avatar">
                    <CodeExample>
                        <Avatar src="https://github.com/idea2app.png" />
                    </CodeExample>
                </Section>

                <Section title="Nameplate">
                    <CodeExample>
                        <Nameplate
                            name="idea2app"
                            avatar="https://github.com/idea2app.png"
                        />
                    </CodeExample>
                </Section>

                <Section title="Spinner Button">
                    <CodeExample>
                        <SpinnerButton
                            className="me-3"
                            animation="border"
                            loading
                        />
                        <SpinnerButton animation="grow" type="submit" loading>
                            Submit
                        </SpinnerButton>
                    </CodeExample>
                </Section>

                <Section title="Select">
                    <CodeExample>
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
                    </CodeExample>
                </Section>

                <Section title="Month Calendar">
                    <CodeExample>
                        <MonthCalendar
                            value={[{ date: new Date(), content: 'Hello!' }]}
                            onSelect={console.log}
                            onChange={console.log}
                        />
                    </CodeExample>
                </Section>

                <Section title="IdeaDialog">
                    <CodeExample>
                        <Button onClick={this.someLogic}>显示弹窗</Button>

                        <this.inputDialog.Component />
                    </CodeExample>
                </Section>

                <Section title="Overlay Box">
                    <CodeExample>
                        <OverlayBox
                            trigger="click"
                            title="view info"
                            detail={
                                <Image src="https://github.com/idea2app.png" />
                            }
                        >
                            <Button>查看</Button>
                        </OverlayBox>
                    </CodeExample>
                </Section>

                <Section title="Page Nav">
                    <CodeBlock language="tsx">
                        <PageNav />
                    </CodeBlock>
                </Section>

                <Section title="Loading">
                    <CodeExample>
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
                    </CodeExample>
                </Section>
            </>
        );
    }
}
