import { ChangeEvent, PropsWithoutRef, PureComponent } from 'react';

import { Icon } from '../Icon';
import * as style from './index.module.less';

export type FilePickerProps = PropsWithoutRef<{
    accept: `${string}/${string}`;
    name: string;
    multiple?: boolean;
    required?: boolean;
    defaultValue?: string[];
}>;

interface State {
    values: string[];
}

export class FilePicker extends PureComponent<FilePickerProps, State> {
    state: Readonly<State> = {
        values: []
    };

    componentDidMount() {
        const { defaultValue: values = [] } = this.props;

        this.setState({ values });
    }

    componentDidUpdate(lastProps: FilePickerProps, lastState: State) {
        const { defaultValue: values = [] } = this.props;

        if (
            lastProps.defaultValue + '' !== values + '' &&
            values + '' !== lastState.values + ''
        )
            this.setState({ values });
    }

    addOne = ({ currentTarget: { files } }: ChangeEvent<HTMLInputElement>) => {
        if (!files) return;

        const { values } = this.state,
            list = Array.from(files, file => URL.createObjectURL(file));

        this.setState({ values: [...values, ...list] });
    };

    deleteOne(index: number) {
        const { values } = this.state;
        const current = values[index];

        if (current.startsWith('blob:')) URL.revokeObjectURL(current);

        this.setState({
            values: [...values.slice(0, index), ...values.slice(index + 1)]
        });
    }

    render() {
        const { accept, name, multiple, required } = this.props,
            { values } = this.state;
        const isImage = accept.startsWith('image/');

        return (
            <ul className="list-unstyled m-0 form-control d-flex flex-wrap">
                {values.map((URI, index) => (
                    <li
                        key={`file-picker-${URI}`}
                        className={`shadow-sm me-3 my-2 ${style.file}`}
                    >
                        <input type="hidden" name={name} value={URI} />

                        {isImage ? (
                            <img src={URI} />
                        ) : (
                            URI.split('/').slice(-1)[0]
                        )}
                        <Icon
                            className={style.close}
                            name="x"
                            onClick={() => this.deleteOne(index)}
                        />
                    </li>
                ))}
                {(!values.length || multiple) && (
                    <li
                        className={`shadow-sm me-3 my-2 ${style.file} ${style.empty}`}
                    >
                        <input
                            type="file"
                            accept={accept}
                            multiple={multiple}
                            required={
                                multiple ? !values.length && required : required
                            }
                            onChange={this.addOne}
                        />
                    </li>
                )}
            </ul>
        );
    }
}
