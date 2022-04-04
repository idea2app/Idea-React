import React from 'react';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import { Icon } from '../Icon';
import styles from './index.module.less';

export interface MultipleFileUploaderProps {
    name?: string;
    value?: string[];
    onChange: Function;
    onDeleteOne: Function;
}

export const MultipleFileUploader = ({
    name,
    onDeleteOne,
    value = [],
    onChange
}: MultipleFileUploaderProps) => (
    <div className={styles.upload}>
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
        <div className={`${styles.file} mt-2`}>
            <Form.Control
                type="file"
                name={name}
                onChange={({ target }) =>
                    onChange((target as HTMLInputElement).files)
                }
                multiple
            />
        </div>
    </div>
);
