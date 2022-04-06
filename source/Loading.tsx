import React, { PropsWithChildren } from 'react';
import Spinner from 'react-bootstrap/Spinner';

export function Loading({ children }: PropsWithChildren<{}>) {
    return (
        <div className="fixed-top h-100 w-100 d-flex justify-content-center align-items-center opacity-25 bg-black">
            <Spinner animation="border" variant="success" />
            <span className="ml-3 text-white"> {children || '加载中...'} </span>
        </div>
    );
}
