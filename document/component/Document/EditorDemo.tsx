'use client';

import { observer } from 'mobx-react';
import { Component, SubmitEvent } from 'react';
import { Editor } from 'react-bootstrap-editor';

import { Button } from '../../../source/Base/Button';
import { Form } from '../../../source/Form';

@observer
export class DocumentEditorDemo extends Component {
    handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        alert(new FormData(event.currentTarget).get('content'));
    };

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Editor name="content" defaultValue="<p>Edit this rich text.</p>" />

                <Button className="mt-3" type="submit" theme="primary" variant="solid">
                    Show saved HTML
                </Button>
            </Form>
        );
    }
}
