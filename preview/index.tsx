import React, { PureComponent, ReactNode } from 'react';
import { Button, Container, Image, Modal } from 'react-bootstrap';
import { render } from 'react-dom';
import { sleep } from 'web-utility';

import {
    Avatar,
    CodeBlock,
    Dialog,
    DialogClose,
    Icon,
    Loading,
    Nameplate,
    OpenMap,
    Option,
    OverlayBox,
    Select,
    SpinnerButton,
    TimeDistance
} from '../source';
import { Section } from './utility';

interface State {
    pageIndex: number;
    selectValue: string;
    showLoading: boolean;
    showDialog: boolean;
    showFormDialog: boolean;
    mapAddressName: string;
}

export class App extends PureComponent<{}, State> {
    state: Readonly<State> = {
        pageIndex: 1,
        selectValue: '0',
        showLoading: false,
        showDialog: false,
        showFormDialog: false,
        mapAddressName: '成都市'
    };

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
            <Modal.Body
                as="form"
                onSubmit={event => {
                    event.preventDefault();

                    defer?.resolve({ a: 1, b: 2 });
                }}
            >
                <Button type="submit">√</Button>
            </Modal.Body>
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
        const { selectValue, showLoading, showDialog, mapAddressName } =
            this.state;

        return (
            <div className="bg-light">
                <Container className="py-5" fluid="md">
                    <h1>Idea React components</h1>

                    <Section title="Time Distance">
                        {this.renderCode(<TimeDistance date="1989-06-04" />)}
                    </Section>

                    <Section title="Icon">
                        {this.renderCode(
                            <Icon
                                name="trash"
                                size={2}
                                className="text-danger"
                            />
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
                                onChange={value =>
                                    this.setState({ selectValue: value })
                                }
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

                    <Section title="IdeaDialog">
                        {this.renderCode(
                            <>
                                <Button onClick={this.someLogic}>
                                    显示弹窗
                                </Button>

                                <this.inputDialog.Component />
                            </>
                        )}
                    </Section>

                    <Section title="IdeaPopover">
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

                    <Section title="Open Map - Basic">
                        {this.renderCode(
                            <OpenMap center={[34.32, 108.55]} zoom={4} />
                        )}
                    </Section>

                    <Section title="Open Map - Display Address">
                        {this.renderCode(
                            <OpenMap
                                zoom={10}
                                title="天府之国"
                                address="成都市"
                            />
                        )}
                    </Section>

                    <Section title="Open Map - Pick Address">
                        {this.renderCode(
                            <OpenMap
                                center={[30.66, 104.06]}
                                zoom={10}
                                address={mapAddressName}
                                onChange={({ address }) =>
                                    this.setState({ mapAddressName: address })
                                }
                            />
                        )}
                    </Section>

                    <Section title="Loading">
                        {this.renderCode(
                            <>
                                <Button
                                    onClick={async () => {
                                        this.setState({ showLoading: true });
                                        await sleep(1);
                                        this.setState({ showLoading: false });
                                    }}
                                    style={{ zIndex: '1040' }}
                                >
                                    显示
                                </Button>
                                {showLoading && <Loading>加载中...</Loading>}
                            </>
                        )}
                    </Section>
                </Container>
            </div>
        );
    }
}

render(<App />, document.querySelector('#app'));
