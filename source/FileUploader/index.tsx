import React, { ChangeEvent, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import { Icon } from '../Icon';
import styles from './index.module.less';

interface FileUploaderProps {
    value?: string;
    name: string;
    disabled?: boolean;
    onChange: Function;
}

function isImageFile(file = '') {
    return /\.(jpeg|jpg|gif|bmp|webp|png)$/i.test(file);
}

function getFileName(file = '') {
    return file?.split(/\\|\//).pop() || '';
}

export function FileUploader({
    name,
    disabled,
    value,
    onChange
}: FileUploaderProps) {
    const [file, setFile] = useState(value);
    const [fileName, setFilename] = useState(getFileName(value));
    const [isImage, setIsImage] = useState(false);

    useEffect(() => {
        setFile(value);
        setIsImage(isImageFile(value));
    }, [value]);

    function change({ target: { files } }: ChangeEvent<HTMLInputElement>) {
        if (!files?.[0]) return;

        setFile(URL.createObjectURL(files[0]));
        setIsImage(files[0].type.startsWith('image/'));
        setFilename(files[0].name);

        onChange(files[0]);
    }

    return (
        <div className={styles.upload}>
            <div className="position-relative">
                {file ? (
                    isImage ? (
                        <a href={file} target="_blank" rel="noreferrer">
                            <Image
                                className={`${styles.image} border rounded mr-3 mt-2`}
                                src={file}
                            />
                        </a>
                    ) : (
                        <div
                            className={`${styles.summary} border rounded mr-3 mt-2`}
                        >
                            <Icon name="file-earmark" size={2} />
                            <div>
                                {fileName.length > 30
                                    ? `${fileName.slice(0, 30)}...`
                                    : fileName}
                            </div>
                        </div>
                    )
                ) : (
                    <div className={`${styles.file} mt-2`} />
                )}
                {!disabled && (
                    <Form.Control type="file" name={name} onChange={change} />
                )}
            </div>
        </div>
    );
}
