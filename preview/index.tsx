import React, { PureComponent, ReactNode } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { render } from 'react-dom';
import { sleep } from 'web-utility';
import {
    Avatar,
    Base,
    Select,
    Option,
    FilePicker,
    FileUploader,
    FilterInput,
    Icon,
    IdeaDialog,
    IdeaForm,
    IdeaFormItem,
    IdeaInfo,
    IdeaInfoItem,
    IdeaPopover,
    IdeaTable,
    Loading,
    CodeBlock,
    AddressPicker,
    MultipleFileUploader,
    Nameplate,
    PaginationBar,
    TableSpinner,
    TimeDistance
} from '../source';
import { Section, SubSection } from './utility';

interface User extends Base {
    name: string;
    link: string;
}

const info: User = {
        id: '1',
        name: 'lingli',
        link: 'https://baidu.com'
    },
    list: User[] = [
        {
            id: '1',
            name: 'lingli',
            link: 'https://baidu.com'
        },
        {
            id: '2',
            name: 'xxx',
            link: 'https://ideapp.dev'
        }
    ];

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
        mapAddressName: ''
    };

    columns: IdeaInfoItem<User>[] = [
        {
            label: '姓名',
            key: 'name'
        },
        {
            label: '链接',
            key: 'link',
            render: ({ link }) => (
                <a href={link} target="_blank">
                    {link}
                </a>
            )
        }
    ];

    formRows: IdeaFormItem<User>[] = [
        {
            label: '课程标题',
            key: 'title'
        },
        {
            label: '作者',
            key: 'author'
        },
        {
            label: '课程链接',
            key: 'link',
            render: ({ link }) => (
                <Form.Control
                    size="sm"
                    name="link"
                    required
                    defaultValue={link}
                />
            )
        }
    ];

    renderCode(code: ReactNode) {
        return (
            <>
                {code}
                <CodeBlock language="tsx">{code}</CodeBlock>
            </>
        );
    }

    render() {
        const {
            pageIndex,
            selectValue,
            showLoading,
            showDialog,
            showFormDialog,
            mapAddressName
        } = this.state;

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

                    <Section title="Filter Input">
                        <p className="text-danger">注：暂有bug</p>
                        {this.renderCode(<FilterInput name="tags" />)}
                    </Section>

                    <Section title="FilePicker">
                        <SubSection title="Single image upload 1">
                            {this.renderCode(
                                <FilePicker accept="image/*" name="images" />
                            )}
                        </SubSection>

                        <SubSection title="Single image upload 2">
                            {this.renderCode(
                                <FileUploader
                                    name="cover"
                                    value="https://github.com/lingziyb.png"
                                    onChange={console.log}
                                />
                            )}
                        </SubSection>

                        <SubSection
                            className="mt-3"
                            title="Multiple images upload"
                        >
                            <p className="text-success small">
                                用法注释：先通过上传接口拿到链接，然后显示所有链接
                            </p>
                            {this.renderCode(
                                <MultipleFileUploader
                                    name="photos"
                                    value={[
                                        'https://github.com/lingziyb.png',
                                        'https://github.com/TechQuery.png'
                                    ]}
                                    onChange={console.log}
                                    onDeleteOne={console.log}
                                />
                            )}
                        </SubSection>
                    </Section>

                    <Section title="IdeaTable">
                        <SubSection title="TableSpinner">
                            {this.renderCode(
                                <IdeaTable
                                    className="small border"
                                    noneNode="暂无数据 -(o﹏o)-， 请添加数据噢"
                                    loadingNode={<TableSpinner colSpan={2} />}
                                    list={list}
                                    columns={this.columns}
                                />
                            )}
                        </SubSection>
                        <SubSection title="有数据时">
                            {this.renderCode(
                                <IdeaTable
                                    className="small border"
                                    noneNode="暂无数据 -(o﹏o)-， 请添加数据噢"
                                    list={list}
                                    columns={this.columns}
                                />
                            )}
                        </SubSection>
                        <SubSection title="无数据时">
                            {this.renderCode(
                                <IdeaTable
                                    className="small border"
                                    noneNode="暂无数据 -(o﹏o)-， 请添加数据噢"
                                    list={[]}
                                    columns={this.columns}
                                />
                            )}
                        </SubSection>
                    </Section>

                    <Section title="Pagination Bar">
                        {this.renderCode(
                            <PaginationBar
                                className="my-3 justify-content-end"
                                size="sm"
                                pageCount={5}
                                currentPage={pageIndex}
                                count={42}
                                onChange={pageIndex =>
                                    this.setState({ pageIndex })
                                }
                            />
                        )}
                    </Section>

                    <Section title="IdeaInfo & IdeaDialog">
                        {this.renderCode(
                            <>
                                <Button
                                    onClick={() =>
                                        this.setState({ showDialog: true })
                                    }
                                >
                                    显示Info弹窗
                                </Button>
                                <IdeaDialog
                                    title="查看"
                                    size="lg"
                                    confirmText="确定"
                                    cancelText="取消"
                                    show={showDialog}
                                    onCancel={() =>
                                        this.setState({ showDialog: false })
                                    }
                                >
                                    <IdeaInfo data={info} rows={this.columns} />
                                </IdeaDialog>
                            </>
                        )}
                    </Section>

                    <Section title="IdeaForm">
                        {this.renderCode(
                            <IdeaForm
                                submitText="submit"
                                resetText="reset"
                                data={info}
                                rows={this.formRows}
                                onSubmit={console.log}
                            />
                        )}
                    </Section>

                    <Section title="IdeaForm & IdeaDialog">
                        {this.renderCode(
                            <>
                                <Button
                                    onClick={() =>
                                        this.setState({ showFormDialog: true })
                                    }
                                >
                                    显示Form弹窗
                                </Button>
                                <IdeaDialog
                                    formId="admin-user-edit"
                                    title="编辑"
                                    confirmText="确定"
                                    cancelText="取消"
                                    show={showFormDialog}
                                    onCancel={() =>
                                        this.setState({ showFormDialog: false })
                                    }
                                >
                                    <IdeaForm
                                        id="admin-user-edit"
                                        className="w-100 border-top-0"
                                        controlClassName="w-100"
                                        labelCols={4}
                                        controlCols={8}
                                        rows={this.formRows}
                                        data={info}
                                        onSubmit={console.log}
                                    />
                                </IdeaDialog>
                            </>
                        )}
                    </Section>

                    <Section title="IdeaPopover">
                        {this.renderCode(
                            <IdeaPopover onShow={console.log} title="view info">
                                <Button>查看</Button>
                                <IdeaTable
                                    className="small border"
                                    noneNode="暂无数据 -(o﹏o)-， 请添加数据噢"
                                    list={list}
                                    columns={this.columns}
                                />
                            </IdeaPopover>
                        )}
                    </Section>

                    <Section title="Map Select">
                        {this.renderCode(
                            <AddressPicker
                                onChange={({ name }) =>
                                    this.setState({ mapAddressName: name })
                                }
                            >
                                <Button>选择</Button>
                                <span className="ps-3">{mapAddressName}</span>
                            </AddressPicker>
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
