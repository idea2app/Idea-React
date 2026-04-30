import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FC, ReactNode } from 'react';
import { Toast as BSToast, ToastContainer, ToastContainerProps } from 'react-bootstrap';

export interface ToastMessage {
    title?: ReactNode;
    body: ReactNode;
    bg?: string;
    delay?: number;
}

export class Toast {
    private idCounter = 0;

    @observable
    accessor messages: (ToastMessage & { id: number })[] = [];

    Component: FC<Pick<ToastContainerProps, 'position'>>;

    constructor() {
        this.Component = observer(({ position = 'top-end' }) => (
            <ToastContainer position={position} className="p-3">
                {this.messages.map(({ id, title, body, bg, delay = 3000 }) => (
                    <BSToast key={id} bg={bg} delay={delay} autohide onClose={() => this.close(id)}>
                        {title && (
                            <BSToast.Header>
                                <strong className="me-auto">{title}</strong>
                            </BSToast.Header>
                        )}
                        <BSToast.Body>{body}</BSToast.Body>
                    </BSToast>
                ))}
            </ToastContainer>
        ));
        this.Component.displayName = 'ToastComponent';
    }

    open(message: ToastMessage) {
        const id = ++this.idCounter;
        this.messages = [...this.messages, { ...message, id }];
        return id;
    }

    close(id: number) {
        this.messages = this.messages.filter(m => m.id !== id);
    }
}
