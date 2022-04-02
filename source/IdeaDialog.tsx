import React, { PropsWithChildren } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface IdeaDialogProps<T> {
    title: string;
    show: boolean;
    onHide?: () => void;
    size?: 'sm' | 'lg' | 'xl';
    formId?: string;
    okText?: string;
    okFun?: () => void;
    cancelText?: string;
    cancelFun?: () => void;
}

export default function IdeaDialog<T>({
    title,
    children,
    formId,
    onHide,
    okText,
    okFun,
    cancelText,
    cancelFun,
    ...rest
}: PropsWithChildren<IdeaDialogProps<T>>) {
    return (
        <Modal {...rest} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {(okText || cancelText) && (
                <Modal.Footer>
                    {cancelText && (
                        <Button
                            variant="secondary"
                            type="reset"
                            form={formId}
                            onClick={cancelFun}
                        >
                            {cancelText}
                        </Button>
                    )}
                    {okText && (
                        <Button variant="primary" type="submit" form={formId}>
                            {okText}
                        </Button>
                    )}
                </Modal.Footer>
            )}
        </Modal>
    );
}
