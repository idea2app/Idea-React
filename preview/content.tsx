import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Button, Form, Image, Modal } from 'react-bootstrap';
import { Day, formToJSON, sleep } from 'web-utility';

import {
    Avatar,
    CodeBlock,
    Countdown,
    Dialog,
    DialogClose,
    HorizontalMarquee,
    Icon,
    Loading,
    MonthCalendar,
    Nameplate,
    Option,
    OverlayBox,
    PageNav,
    Select,
    ShareBox,
    SpinnerButton,
    TextTruncate,
    Time,
    TimeDistance,
    Timeline,
    TypeEcho,
    UserRankView,
    VerticalMarquee,
    ZodiacBar
} from '../source';
import { CodeExample, LiveExample, Section } from './utility';

@observer
export class Content extends Component {
    @observable
    accessor pageIndex = 1;

    @observable
    accessor selectValue = '0';

    @observable
    accessor showLoading = false;

    inputDialog = new Dialog<{}, Record<'a' | 'b', number>>(({ defer }) => (
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
                    <LiveExample>
                        <TypeEcho text="Hello, Idea React!" />
                    </LiveExample>
                </Section>

                <Section title="Text Truncate">
                    <LiveExample>
                        <TextTruncate rows={2}>
                            Idea React is a React advanced components library based on TypeScript &
                            Bootstrap, built by idea2app remote developers team. It provides a set
                            of reusable, well-designed components that help developers build modern
                            Web applications quickly and efficiently. The library includes
                            components for common UI patterns such as dialogs, forms, navigation,
                            and more.
                        </TextTruncate>
                    </LiveExample>
                </Section>

                <Section title="Horizontal Marquee">
                    <LiveExample>
                        <HorizontalMarquee>{'idea2app '.repeat(15).trim()}</HorizontalMarquee>
                    </LiveExample>
                </Section>

                <Section title="Vertical Marquee">
                    <LiveExample>
                        <VerticalMarquee style={{ height: '10rem' }}>
                            <img src="https://tech-query.me/medias/featureimages/22.jpg" />
                        </VerticalMarquee>
                    </LiveExample>
                </Section>

                <Section title="Time">
                    <LiveExample>
                        <Time dateTime="2022-11-27" format="YYYY 年 MM 月 DD 日 HH:mm" />
                    </LiveExample>
                </Section>

                <Section title="Time Distance">
                    <LiveExample>
                        <TimeDistance date="1989-06-04" />
                    </LiveExample>
                </Section>

                <Section title="Countdown">
                    <LiveExample>
                        <Countdown
                            className="d-flex gap-3"
                            units={[
                                { scale: 24, label: '天' },
                                { scale: 60, label: '时' },
                                { scale: 60, label: '分' },
                                { scale: 1000, label: '秒' }
                            ]}
                            endTime={Date.now() + 3 * Day}
                        />
                    </LiveExample>
                </Section>

                <Section title="Timeline">
                    <LiveExample>
                        <div
                            style={{
                                background:
                                    'linear-gradient(to right, rgba(235, 187, 167, 1), rgba(207, 199, 248, 1))'
                            }}
                        >
                            <Timeline
                                events={[
                                    { title: 'Discover', time: ['2019-12-01'] },
                                    { title: 'Deny', time: ['2020-01-02'] },
                                    {
                                        title: 'Lock down',
                                        time: ['2020-01-23']
                                    },
                                    { title: 'Open', time: ['2022-12-01'] }
                                ]}
                                timeFormat="YYYY-MM-DD"
                            />
                        </div>
                    </LiveExample>
                </Section>

                <Section title="Icon">
                    <LiveExample>
                        <Icon name="trash" size={2} className="text-danger" />
                    </LiveExample>
                </Section>

                <Section title="Avatar">
                    <LiveExample>
                        <Avatar src="https://github.com/idea2app.png" />
                    </LiveExample>
                </Section>

                <Section title="Nameplate">
                    <LiveExample>
                        <Nameplate name="idea2app" avatar="https://github.com/idea2app.png" />
                    </LiveExample>
                </Section>

                <Section title="Spinner Button">
                    <LiveExample>
                        <SpinnerButton className="me-3" animation="border" loading />
                        <SpinnerButton animation="grow" type="submit" loading>
                            Submit
                        </SpinnerButton>
                    </LiveExample>
                </Section>

                <Section title="Select">
                    <LiveExample>
                        <Select value={selectValue} onChange={value => (this.selectValue = value)}>
                            <Option value="0">
                                <Icon className="me-2" name="heart" />
                                idea2app
                            </Option>
                            <Option value="1">
                                <Icon className="me-2" name="bootstrap" />
                                freeCodeCamp
                            </Option>
                        </Select>
                    </LiveExample>
                </Section>

                <Section title="Month Calendar">
                    <LiveExample>
                        <MonthCalendar
                            value={[{ date: new Date(), content: 'Hello!' }]}
                            onSelect={console.log}
                            onChange={console.log}
                        />
                    </LiveExample>
                </Section>

                <Section title="IdeaDialog">
                    <CodeExample>
                        <Button onClick={this.someLogic}>显示弹窗</Button>

                        <this.inputDialog.Component />
                    </CodeExample>
                </Section>

                <Section title="Share Box">
                    <LiveExample>
                        <ShareBox
                            title="idea2app"
                            text="Every idea of yours is worth our efforts to realize"
                            url="https://idea2app.cn"
                        >
                            <Nameplate name="idea2app" avatar="https://github.com/idea2app.png" />
                        </ShareBox>
                        click to share
                    </LiveExample>
                </Section>

                <Section title="Overlay Box">
                    <CodeExample>
                        <OverlayBox
                            trigger="click"
                            title="view info"
                            detail={<Image src="https://github.com/idea2app.png" />}
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
                            style={{ zIndex: '1040' }}
                            onClick={async () => {
                                this.showLoading = true;
                                await sleep(1);
                                this.showLoading = false;
                            }}
                        >
                            显示
                        </Button>
                        {showLoading && <Loading>加载中...</Loading>}
                    </CodeExample>
                </Section>

                <Section title="User Rank">
                    <LiveExample>
                        <UserRankView
                            title="GitHub"
                            rank={['Five-great', 'TechQuery', 'stevending1st', 'wangrunlin'].map(
                                (name, index) => ({
                                    id: index + 1,
                                    name,
                                    avatar: `https://github.com/${name}.png`,
                                    website: `https://github.com/${name}`,
                                    score: 100 - index
                                })
                            )}
                            linkOf={({ id }) => `/user/${id}`}
                        />
                    </LiveExample>
                </Section>

                <Section title="Zodiac Bar">
                    <CodeExample>
                        <ZodiacBar startYear={2020} endYear={2022} itemOf={title => ({ title })} />
                    </CodeExample>
                </Section>
            </>
        );
    }
}
