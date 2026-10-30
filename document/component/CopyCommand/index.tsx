'use client';

import { observer } from 'mobx-react';
import { Component } from 'react';

import { Button } from '../../../source/Button';
import { Icon } from '../../../source/Icon';
import { ClipboardModel } from './model';

export interface CopyCommandProps {
    children: string;
}

@observer
export class CopyCommand extends Component<CopyCommandProps> {
    model = new ClipboardModel();

    handleCopy = () => void this.model.copy(this.props.children);

    render() {
        const { children } = this.props;
        const { status } = this.model;

        return (
            <div className="d-flex position-relative align-items-center justify-content-between gap-7 border rounded-8 bg-1 px-5 py-4">
                <code className="text-sm fg-body text-break">{children}</code>
                <Button
                    type="button"
                    variant="text"
                    className="d-inline-flex p-1"
                    aria-label={status === 'copied' ? 'Command copied' : 'Copy install command'}
                    title={status === 'copied' ? 'Copied!' : 'Copy'}
                    disabled={status === 'copying'}
                    onClick={this.handleCopy}
                >
                    <Icon name={status === 'copied' ? 'check2' : 'copy'} aria-hidden="true" />
                </Button>
                <span className="visually-hidden" role="status">
                    {status === 'copied' ? 'Install command copied' : ''}
                </span>
            </div>
        );
    }
}
