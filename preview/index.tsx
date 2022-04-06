import classNames from 'classnames';
import React, { PropsWithChildren, PureComponent } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { render } from 'react-dom';
import { sleep } from 'web-utility';
import {
    Avatar,
    Base,
    FilePicker,
    FileUploader,
    FilterInput,
    Icon,
    IdeaDialog,
    IdeaForm,
    IdeaFormItem,
    IdeaInfo,
    IdeaInfoItem,
    IdeaTable,
    Loading,
    Map,
    MultipleFileUploader,
    Nameplate,
    PaginationBar,
    TableSpinner,
    TimeDistance
} from '../source';

interface User extends Base {
    name: string;
    link: string;
}

type SectionProps = PropsWithChildren<{
    className?: string;
    title: string;
}>;

function Section({ className, title, children }: SectionProps) {
    return (
        <section
            className={classNames(
                'border',
                'bg-white',
                'mt-3',
                'p-3',
                className
            )}
        >
            <h3>{title}</h3>

            {children}
        </section>
    );
}

function SubSection({ className, title, children }: SectionProps) {
    return (
        <>
            <h4 className={classNames('h6', className)}>{title}</h4>

            {children}
        </>
    );
}

export class App extends PureComponent {
    state = {
        showDialog: false,
        showFormDialog: false,
        pageIndex: 1,
        mapAddressName: '',
        showLoading: false
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
        const {
            showDialog,
            showFormDialog,
            pageIndex,
            mapAddressName,
            showLoading
        } = this.state;
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

                    <Section title="Time Distance">
                        <TimeDistance date="1989-06-04" />
                    </Section>

                    <Section title="Icon">
                        <Icon name="trash" size={2} className="text-danger" />
                    </Section>

                    <Section title="Avatar">
                        <Avatar src="https://github.com/idea2app.png" />
                    </Section>

                    <Section title="Nameplate">
                        <Nameplate
                            name="idea2app"
                            avatar="https://github.com/idea2app.png"
                        />
                    </Section>

                    <Section title="Filter Input">
                        <FilterInput name="tags" />
                    </Section>

                    <Section title="FilePicker">
                        <SubSection title="Single image upload 1">
                            <FilePicker accept="image/*" name="images" />
                        </SubSection>

                        <SubSection title="Single image upload 2">
                            <FileUploader
                                name="cover"
                                value="http://xydlinger.cn/medias/banner/5.jpg"
                                onChange={console.log}
                            />
                        </SubSection>

                        <SubSection
                            className="mt-3"
                            title="Multiple images upload"
                        >
                            <p className="text-success small">
                                用法注释：先通过上传接口拿到链接，然后显示所有链接
                            </p>
                            <MultipleFileUploader
                                name="photos"
                                value={[
                                    'http://xydlinger.cn/medias/banner/5.jpg',
                                    'http://xydlinger.cn/medias/banner/2.jpg'
                                ]}
                                onChange={console.log}
                                onDeleteOne={console.log}
                            />
                        </SubSection>
                    </Section>

                    <Section title="IdeaTable">
                        <SubSection title="TableSpinner">
                            <IdeaTable
                                className="small border"
                                noneNode="暂无数据 -(o﹏o)-， 请添加数据噢"
                                loadingNode={<TableSpinner colSpan={2} />}
                                list={list}
                                columns={this.columns}
                            />
                        </SubSection>
                        <SubSection title="有数据时">
                            <IdeaTable
                                className="small border"
                                noneNode="暂无数据 -(o﹏o)-， 请添加数据噢"
                                list={list}
                                columns={this.columns}
                            />
                        </SubSection>
                        <SubSection title="无数据时">
                            <IdeaTable
                                className="small border"
                                noneNode="暂无数据 -(o﹏o)-， 请添加数据噢"
                                list={[]}
                                columns={this.columns}
                            />
                        </SubSection>
                    </Section>

                    <Section title="Pagination Bar">
                        <PaginationBar
                            className="my-3 justify-content-end"
                            size="sm"
                            pageCount={5}
                            currentPage={pageIndex}
                            count={42}
                            onChange={pageIndex => this.setState({ pageIndex })}
                        />
                    </Section>

                    <Section title="IdeaInfo & IdeaDialog">
                        <Button
                            onClick={() => this.setState({ showDialog: true })}
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
                    </Section>

                    <Section title="IdeaForm">
                        <IdeaForm
                            submitText="submit"
                            resetText="reset"
                            data={info}
                            rows={this.formRows}
                            onSubmit={console.log}
                        />
                    </Section>

                    <Section title="IdeaForm & IdeaDialog">
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
                    </Section>

                    <Section title="Map Select">
                        <Map
                            onChange={({ name }) =>
                                this.setState({ mapAddressName: name })
                            }
                        >
                            <Button>选择</Button>
                            <span className="ps-3">{mapAddressName}</span>
                        </Map>
                    </Section>

                    <Section title="Loading">
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
                    </Section>
                </Container>
            </div>
        );
    }
}

render(<App />, document.querySelector('#app'));
