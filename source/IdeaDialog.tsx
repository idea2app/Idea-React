import React, { PropsWithChildren } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface IdeaDialogProps<T> {
    title: string;
    show: boolean;
    onHide?: () => void;
    size?: 'sm' | 'lg' | 'xl';
    formId?: string;
    confirmText?: string;
    onConfirm?: () => any;
    cancelText?: string;
    onCancel?: () => any;
}

export default function IdeaDialog<T>({
    title,
    children,
    formId,
    onHide,
    confirmText,
    onConfirm,
    cancelText,
    onCancel,
    ...rest
}: PropsWithChildren<IdeaDialogProps<T>>) {
    return (
        <Modal {...rest} onHide={onHide}>
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
}
