import React, { Component } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { render } from 'react-dom';
import IdeaDialog from '../source/IdeaDialog';
import IdeaForm, { IdeaFormItem } from '../source/IdeaForm';
import IdeaInfo, { IdeaInfoItem } from '../source/IdeaInfo';
import IdeaTable, { Base } from '../source/IdeaTable';

interface User extends Base {
    name: string;
    link: string;
}

export class App extends Component {
    state = {
        showDialog: false,
        showFormDialog: false
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

    render() {
        const { showDialog, showFormDialog } = this.state;
        const info: User = {
            id: '1',
            name: 'lingli',
            link: 'https://baidu.com'
        };
        const list: User[] = [
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

        return (
            <Container className="my-3" fluid="md">
                <h1>Extra components</h1>

                <div className="py-2 px-3 border">
                    <h3 className="mt-3">IdeaTable</h3>
                    <IdeaTable
                        list={list}
                        columns={this.columns}
                        className="small border"
                    >
                        暂无数据 -(o﹏o)-， 请添加数据噢
                    </IdeaTable>
                </div>

                <div className="py-2 px-3 border mt-3">
                    <h3 className="mt-3">IdeaInfo && IdeaDialog</h3>
                    <Button onClick={() => this.setState({ showDialog: true })}>
                        显示Info弹窗
                    </Button>
                    <IdeaDialog
                        title="查看"
                        size="lg"
                        show={showDialog}
                        confirmText="确定"
                        cancelText="取消"
                        onCancel={() => this.setState({ showDialog: false })}
                    >
                        <IdeaInfo data={info} rows={this.columns} />
                    </IdeaDialog>
                </div>

                <div className="py-2 px-3 border mt-3">
                    <h2 className="mt-3">IdeaForm</h2>
                    <IdeaForm
                        data={info}
                        rows={this.formRows}
                        onSubmit={() => {}}
                    />
                </div>

                <div className="py-2 px-3 border mt-3">
                    <h2 className="mt-3">IdeaForm & IdeaDialog</h2>
                    <Button
                        onClick={() => this.setState({ showFormDialog: true })}
                    >
                        显示Form弹窗
                    </Button>
                    <IdeaDialog
                        title="编辑"
                        show={showFormDialog}
                        confirmText="确定"
                        cancelText="取消"
                        onCancel={() =>
                            this.setState({ showFormDialog: false })
                        }
                        formId="admin-user-edit"
                    >
                        <IdeaForm
                            id="admin-user-edit"
                            rows={this.formRows}
                            data={info}
                            labelWidth={4}
                            controlWidth={8}
                            className="w-100 border-top-0"
                            controlClassName="w-100"
                            showFooter={false}
                            onSubmit={() => {}}
                        />
                    </IdeaDialog>
                </div>
            </Container>
        );
    }
}

render(<App />, document.querySelector('#app'));
