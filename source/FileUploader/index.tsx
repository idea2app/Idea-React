import { ChangeEvent, Component } from 'react';
import { Form, Image } from 'react-bootstrap';

import { Icon } from '../Icon';
import * as styles from './index.module.less';

export interface FileUploaderProps {
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
    static displayName = 'FileUploader';

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
            <div className={styles.upload}>
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
                            <div className="border rounded mr-3 mt-2 p-2 d-flex justify-content-center align-items-center flex-column">
                                <Icon name="file-earmark" size={2} />
                                <div
                                    className={`${styles.summary} text-truncate`}
                                >
                                    {fileName}
                                </div>
                            </div>
                        )
                    ) : (
                        <div
                            className={`${styles.file} border rounded mt-2 d-flex justify-content-center align-items-center position-relative`}
                        />
                    )}
                    {!disabled && (
                        <Form.Control
                            className="position-absolute top-0 start-0 opacity-0"
                            type="file"
                            name={name}
                            onChange={this.change}
                        />
                    )}
                </div>
            </div>
        );
    }
}
