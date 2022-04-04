import React, { Component } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { render } from 'react-dom';
import { Avatar } from '../source/Avatar';
import { Back } from '../source/Back';
import { FilePicker } from '../source/FilePicker';
import { FileUploader } from '../source/FileUploader';
import { FilterInput } from '../source/FilterInput';
import { Icon } from '../source/Icon';
import IdeaDialog from '../source/IdeaDialog';
import IdeaForm, { IdeaFormItem } from '../source/IdeaForm';
import IdeaInfo, { IdeaInfoItem } from '../source/IdeaInfo';
import IdeaTable, { Base } from '../source/IdeaTable';
import { MultipleFileUploader } from '../source/MultipleFileUploader';
import { Nameplate } from '../source/Nameplate';
import { PaginationBar } from '../source/PaginationBar';
import { TableSpinner } from '../source/TableSpinner';
import { TimeDistance } from '../source/TimeDistance';

interface User extends Base {
    name: string;
    link: string;
}

export class App extends Component {
    state = {
        showDialog: false,
        showFormDialog: false,
        pageIndex: 1
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
        const { showDialog, showFormDialog, pageIndex } = this.state;
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
            <div className="bg-light">
                <Container className="py-5" fluid="md">
                    <h1>Extra components</h1>

                    <div className="p-3 border mt-3 bg-white">
                        <h3>Time Distance</h3>
                        <TimeDistance date="1989-06-04" />
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3>Icon</h3>
                        <Icon name="trash" size={2} className="text-danger" />
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3>Avatar</h3>
                        <Avatar src="https://github.com/idea2app.png" />
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3>Nameplate</h3>
                        <Nameplate
                            name="idea2app"
                            avatar="https://github.com/idea2app.png"
                        />
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3>Back</h3>
                        <Back>返回</Back>
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3>Filter Input</h3>
                        <FilterInput name="tags" />
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3>FilePicker</h3>

                        <h6>one image upload-1</h6>
                        <FilePicker accept="image/*" name="images" />

                        <h6 className="mt-3">one image upload-2</h6>
                        <FileUploader
                            name="cover"
                            value="http://xydlinger.cn/medias/banner/5.jpg"
                            onChange={file => console.log(file)}
                        />

                        <h6 className="mt-3">multiple images upload</h6>
                        <p className="text-success">
                            <small>
                                用法注释：先通过上传接口拿到链接，然后显示所有链接
                            </small>
                        </p>
                        <MultipleFileUploader
                            name="photos"
                            value={[
                                'http://xydlinger.cn/medias/banner/5.jpg',
                                'http://xydlinger.cn/medias/banner/2.jpg'
                            ]}
                            onChange={(files: FileList) => console.log(files)}
                            onDeleteOne={(index: number) => console.log(index)}
                        />
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3 className="mt-3">IdeaTable</h3>
                        <h6>TableSpinner</h6>
                        <IdeaTable
                            className="small border"
                            noneNode="暂无数据 -(o﹏o)-， 请添加数据噢"
                            list={list}
                            columns={this.columns}
                            loadingNode={<TableSpinner colSpan={2} />}
                        />
                        <h6>有数据时</h6>
                        <IdeaTable
                            className="small border"
                            noneNode="暂无数据 -(o﹏o)-， 请添加数据噢"
                            list={list}
                            columns={this.columns}
                        />
                        <h6>无数据时</h6>
                        <IdeaTable
                            className="small border"
                            noneNode="暂无数据 -(o﹏o)-， 请添加数据噢"
                            list={[]}
                            columns={this.columns}
                        />
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3>Pagination Bar</h3>
                        <PaginationBar
                            className="my-3 justify-content-end"
                            size="sm"
                            pageCount={5}
                            currentPage={pageIndex}
                            count={42}
                            onChange={page =>
                                this.setState({ pageIndex: page })
                            }
                        />
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3 className="mt-3">IdeaInfo && IdeaDialog</h3>
                        <Button
                            onClick={() => this.setState({ showDialog: true })}
                        >
                            显示Info弹窗
                        </Button>
                        <IdeaDialog
                            title="查看"
                            size="lg"
                            show={showDialog}
                            confirmText="确定"
                            cancelText="取消"
                            onCancel={() =>
                                this.setState({ showDialog: false })
                            }
                        >
                            <IdeaInfo data={info} rows={this.columns} />
                        </IdeaDialog>
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3>IdeaForm</h3>
                        <IdeaForm
                            submitText="submit"
                            resetText="reset"
                            data={info}
                            rows={this.formRows}
                            onSubmit={console.log}
                        />
                    </div>

                    <div className="p-3 border mt-3 bg-white">
                        <h3>IdeaForm & IdeaDialog</h3>
                        <Button
                            onClick={() =>
                                this.setState({ showFormDialog: true })
                            }
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
                                className="w-100 border-top-0"
                                controlClassName="w-100"
                                labelCols={4}
                                controlCols={8}
                                rows={this.formRows}
                                data={info}
                                onSubmit={console.log}
                            />
                        </IdeaDialog>
                    </div>
                </Container>
            </div>
        );
    }
}

render(<App />, document.querySelector('#app'));
