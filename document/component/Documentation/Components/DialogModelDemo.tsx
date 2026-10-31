'use client';

import { observer } from 'mobx-react';
import { Component, FormEvent } from 'react';
import { formToJSON } from 'web-utility';

import { Button } from '../../../../source/Button';
import { CloseButton } from '../../../../source/CloseButton';
import { Dialog, DialogClose } from '../../../../source/Dialog';
import { NativeDialog } from '../../../../source/NativeDialog';

@observer
export class DialogModelDemo extends Component {
    inputDialog = new Dialog<{}, Record<'a' | 'b', number>>(({ defer }) => (
        <NativeDialog
            open={!!defer}
            aria-label="Input dialog"
            onClose={() => defer?.reject(new DialogClose())}
        >
            <div className="dialog-header">
                <h1 className="dialog-title">Dialog</h1>
                <CloseButton onClick={() => defer?.reject(new DialogClose())} />
            </div>
            <form
                id="dialog-model-form"
                className="dialog-body"
                onSubmit={this.handleSubmit}
                onReset={() => defer?.reject(new DialogClose())}
            >
                <div className="mb-3">
                    <label className="form-label" htmlFor="dialog-model-a">
                        A
                    </label>
                    <input className="form-control" id="dialog-model-a" name="a" type="number" />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="dialog-model-b">
                        B
                    </label>
                    <input className="form-control" id="dialog-model-b" name="b" type="number" />
                </div>
            </form>
            <div className="dialog-footer">
                <Button variant="solid" theme="primary" form="dialog-model-form" type="submit">
                    √
                </Button>
                <Button variant="solid" theme="danger" form="dialog-model-form" type="reset">
                    ×
                </Button>
            </div>
        </NativeDialog>
    ));

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        this.inputDialog.defer?.resolve(formToJSON<Record<'a' | 'b', number>>(event.currentTarget));
    };

    handleOpen = async () => {
        try {
            const data = await this.inputDialog.open();

            alert(JSON.stringify(data, null, 4));
        } catch (error) {
            if (error instanceof DialogClose) console.warn(error.message);
        }
    };

    render() {
        return (
            <>
                <Button variant="solid" theme="primary" onClick={this.handleOpen}>
                    Show dialog
                </Button>

                <this.inputDialog.Component />
            </>
        );
    }
}
