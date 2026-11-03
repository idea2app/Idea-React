'use client';

import { observer } from 'mobx-react';
import { Component, FormEvent } from 'react';
import { formToJSON } from 'web-utility';

import { Button } from '../../../../source/Button';
import { CloseButton } from '../../../../source/CloseButton';
import { Dialog, DialogClose } from '../../../../source/Extension/Dialog';
import { FormControl, FormField, FormLabel } from '../../../../source/Form';
import {
    DialogBody,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    NativeDialog
} from '../../../../source/NativeDialog';

@observer
export class DialogModelDemo extends Component {
    inputDialog = new Dialog<{}, Record<'a' | 'b', number>>(({ defer }) => (
        <NativeDialog
            open={!!defer}
            aria-label="Input dialog"
            onClose={() => defer?.reject(new DialogClose())}
        >
            <DialogHeader>
                <DialogTitle>Dialog</DialogTitle>
                <CloseButton onClick={() => defer?.reject(new DialogClose())} />
            </DialogHeader>
            <DialogBody>
                <form
                    id="dialog-model-form"
                    onSubmit={this.handleSubmit}
                    onReset={() => defer?.reject(new DialogClose())}
                >
                    <FormField className="mb-3">
                        <FormLabel htmlFor="dialog-model-a">A</FormLabel>
                        <FormControl id="dialog-model-a" name="a" type="number" />
                    </FormField>
                    <FormField className="mb-3">
                        <FormLabel htmlFor="dialog-model-b">B</FormLabel>
                        <FormControl id="dialog-model-b" name="b" type="number" />
                    </FormField>
                </form>
            </DialogBody>
            <DialogFooter>
                <Button variant="solid" theme="primary" form="dialog-model-form" type="submit">
                    √
                </Button>
                <Button variant="solid" theme="danger" form="dialog-model-form" type="reset">
                    ×
                </Button>
            </DialogFooter>
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
