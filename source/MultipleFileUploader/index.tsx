import { FC } from 'react';
import { Form, Image } from 'react-bootstrap';

import { Icon } from '../Icon';
import * as styles from './index.module.less';

export interface MultipleFileUploaderProps {
    name?: string;
    value?: string[];
    onChange: Function;
    onDeleteOne: Function;
}

export const MultipleFileUploader: FC<MultipleFileUploaderProps> = ({
    name,
    onDeleteOne,
    value = [],
    onChange
}) => (
    <div className={`${styles.upload} rounded d-flex flex-wrap`}>
        {value.map((item, index) => (
            <div className="position-relative" key={index}>
                <Icon
                    name="x"
                    size={1.2}
                    className={`position-absolute ${styles['delete-icon']}`}
                    onClick={() => onDeleteOne(index)}
                />
                <Image
                    className={`${styles.image} border rounded me-2 mt-2`}
                    src={item}
                />
            </div>
        ))}
        <div
            className={`${styles.file} border rounded mt-2 d-flex justify-content-center align-items-center position-relative overflow-hidden`}
        >
            <Form.Control
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                type="file"
                multiple
                name={name}
                onChange={({ target }) =>
                    onChange((target as HTMLInputElement).files)
                }
            />
        </div>
    </div>
);

MultipleFileUploader.displayName = 'MultipleFileUploader';
