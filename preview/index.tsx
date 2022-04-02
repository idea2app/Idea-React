import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import { render } from 'react-dom';
import IdeaDialog from '../source/IdeaDialog';
import IdeaInfo, { IdeaInfoItem } from '../source/IdeaInfo';

interface User {
    name: string;
    link: string;
}

export class App extends Component {
    state = {
        showDialog: false
    };

    ideaInfoRows: IdeaInfoItem<User>[] = [
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

    render() {
        const { showDialog } = this.state;
        const info: User = {
            name: 'lingli',
            link: 'https://baidu.com'
        };

        return (
            <Container className="my-3" fluid="md">
                <h1>Extra components</h1>

                <h2 className="mt-3">IdeaInfo && IdeaDialog</h2>
                <Button onClick={() => this.setState({ showDialog: true })}>
                    显示弹窗
                </Button>
                <IdeaDialog
                    title="查看"
                    size="lg"
                    show={showDialog}
                    okText="确定"
                    cancelText="取消"
                    cancelFun={() => this.setState({ showDialog: false })}
                >
                    <IdeaInfo data={info} rows={this.ideaInfoRows} />
                </IdeaDialog>
            </Container>
        );
    }
}

render(<App />, document.querySelector('#app'));
