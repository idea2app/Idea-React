'use client';

import { Component } from 'react';

export class ErrorHandler extends Component {
    componentDidMount() {
        window.addEventListener('unhandledrejection', this.handleRejection);
    }

    componentWillUnmount() {
        window.removeEventListener('unhandledrejection', this.handleRejection);
    }

    handleRejection = ({ reason }: PromiseRejectionEvent) =>
        alert(reason instanceof Error ? reason.message : String(reason));

    render() {
        return null;
    }
}
