import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { render } from "react-dom";
import IdeaTable, { Column } from "../source/IdeaTable";

interface User {
    name: string;
    link: string;
}

export class App extends Component {
    columns: Column<User>[] = [
        {
            label: '姓名',
            key: 'name'
        },
        {
            label: '链接',
            key: 'link',
            width: 300,
            render: ({ link }) => (
                <a href={link} target="_blank">
                    {link}
                </a>
            )
        },
    ];

    render() {
        const list: User[] = [{
            name: 'lingli',
            link: 'https://baidu.com'
        },
        {
            name: 'xxx',
            link: 'https://idea2app.com'
        }];

        return (
            <Container className="my-3" fluid="md">
                <h1>Extra components</h1>

                <h2 className="mt-3">IdeaTable</h2>
                <IdeaTable list={list} columns={this.columns} />
            </Container>
        )
    }
}

render(<App />, document.querySelector("#app"));