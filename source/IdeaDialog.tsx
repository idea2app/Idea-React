import React, { FC, PropsWithChildren } from 'react';
import { Button, Modal } from 'react-bootstrap';

export type IdeaDialogProps = PropsWithChildren<{
    title: string;
    show: boolean;
    size?: 'sm' | 'lg' | 'xl';
    formId?: string;
    confirmText?: string;
    onConfirm?: () => any;
    cancelText?: string;
    onCancel?: () => any;
}>;

export const IdeaDialog: FC<IdeaDialogProps> = ({
    title,
    children,
    formId,
    confirmText,
    onConfirm,
    cancelText,
    onCancel,
    ...rest
}) => (
    <Modal {...rest} onHide={onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>

        {(confirmText || cancelText) && (
            <Modal.Footer>
                {cancelText && (
                    <Button
                        variant="secondary"
                        type="reset"
                        form={formId}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </Button>
                )}
                {confirmText && (
                    <Button variant="primary" type="submit" form={formId}>
                        {confirmText}
                    </Button>
                )}
            </Modal.Footer>
        )}
    </Modal>
);

IdeaDialog.displayName = 'IdeaDialog';
