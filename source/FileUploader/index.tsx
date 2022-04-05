import classNames from 'classnames';
import React, { ChangeEvent, Component } from 'react';
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

interface FileUploaderState {
    file: string;
    fileName: string;
    isImage: boolean;
}

function isImageFile(file = '') {
    return /\.(jpe?g|gif|bmp|webp|png)$/i.test(file);
}

function getFileName(file = '') {
    return file?.split(/\\|\//).pop() || '';
}

export class FileUploader extends Component<
    FileUploaderProps,
    FileUploaderState
> {
    state = {
        file: '',
        fileName: '',
        isImage: false
    };

    componentDidMount() {
        const { value } = this.props;

        this.setState({
            file: value,
            fileName: getFileName(value),
            isImage: isImageFile(value)
        });
    }

    change = ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
        if (!files?.[0]) return;

        this.setState({
            file: URL.createObjectURL(files[0]),
            isImage: files[0].type.startsWith('image/'),
            fileName: files[0].name
        });

        this.props.onChange(files[0]);
    };

    render() {
        const { name, disabled } = this.props;
        const { file, isImage, fileName } = this.state;

        return (
            <div className={classNames(styles.upload)}>
                <div className="position-relative">
                    {file ? (
                        isImage ? (
                            <a href={file} target="_blank" rel="noreferrer">
                                <Image
                                    className={`${styles.image} border rounded mr-3`}
                                    src={file}
                                />
                            </a>
                        ) : (
                            <div
                                className={`${styles.summary} border rounded mr-3 mt-2 d-flex justify-content-center align-items-center flex-column p-2 overflow-hidden`}
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
                        <div
                            className={`${styles.file} mt-2 d-flex justify-content-center align-items-center border rounded position-relative overflow-hidden`}
                        />
                    )}
                    {!disabled && (
                        <Form.Control
                            type="file"
                            name={name}
                            onChange={this.change}
                            className="position-absolute"
                        />
                    )}
                </div>
            </div>
        );
    }
}
