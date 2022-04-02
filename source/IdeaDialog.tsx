import React, { PropsWithChildren } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface IdeaDialogProps<T> {
    title: string;
    show: boolean;
    onHide?: () => void;
    size?: 'sm' | 'lg' | 'xl';
    formId?: string;
    showFooter?: boolean
}

export default function IdeaDialog<T>({
    title,
    children,
    formId,
    onHide,
    showFooter = true,
    ...rest
}: PropsWithChildren<IdeaDialogProps<T>>) {
    return (
        <Modal {...rest} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            {showFooter && <Modal.Footer>
                <Button variant="secondary" type="reset" form={formId} onClick={onHide} >取消</Button>
                <Button variant="primary" type="submit" form={formId}>确定</Button>
            </Modal.Footer>}
        </Modal>
    );
}
