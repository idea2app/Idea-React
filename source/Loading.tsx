import React, { PropsWithChildren } from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function Loading({ children }: PropsWithChildren<{}>) {
    return (
        <div
            className="fixed-top h-100 w-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
            <Spinner animation="border" variant="success" />
            <span className="ml-3 text-white"> {children || '加载中...'} </span>
        </div>
    );
}
