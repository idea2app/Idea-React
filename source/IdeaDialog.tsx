import { FC } from 'react';
import { Button, Modal, ModalDialog, ModalDialogProps } from 'react-bootstrap';

import { SpinnerButtonProps, SpinnerButton } from './SpinnerButton';

export interface IdeaDialogProps
    extends Partial<Pick<SpinnerButtonProps, 'animation' | 'loading'>> {
    title: string;
    show: boolean;
    className?: string;
    formId?: string;
    confirmText?: string;
    onConfirm?: () => any;
    cancelText?: string;
    onCancel?: () => any;
    size?: 'sm' | 'lg' | 'xl';
    fullscreen?:
        | true
        | string
        | 'sm-down'
        | 'md-down'
        | 'lg-down'
        | 'xl-down'
        | 'xxl-down';
    centered?: boolean;
    scrollable?: boolean;
    contentClassName?: string;
}

export const IdeaDialog: FC<IdeaDialogProps> = ({
    children,
    title,
    formId,
    confirmText,
    onConfirm,
    cancelText,
    onCancel,
    animation = 'border',
    loading,
    show,
    ...rest
}) => (
    <>
        <div className="fade modal-backdrop show" />
        <div className="show modal fade" style={{ display: 'block' }}>
            <ModalDialog {...rest}>
                <Modal.Header closeButton onHide={onCancel}>
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
                                disabled={loading}
                                onClick={onCancel}
                            >
                                {cancelText}
                            </Button>
                        )}
                        {confirmText && (
                            <SpinnerButton
                                variant="primary"
                                type="submit"
                                form={formId}
                                animation={animation}
                                loading={loading}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </SpinnerButton>
                        )}
                    </Modal.Footer>
                )}
            </ModalDialog>
        </div>
    </>
);

IdeaDialog.displayName = 'IdeaDialog';
