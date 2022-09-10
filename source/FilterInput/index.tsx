import { debounce } from 'lodash';
import { KeyboardEvent, PureComponent, createRef } from 'react';
import { Badge } from 'react-bootstrap';

import { Icon } from '../Icon';
import * as style from './index.module.less';

export interface OptionItem {
    value?: any;
    label: string;
}

export interface FilterInputProps {
    name: string;
    required?: boolean;
    defaultValue?: OptionItem[];
    loadOptions?: (input: string) => Promise<OptionItem[]>;
}

interface State {
    options: OptionItem[];
    values: OptionItem[];
}

export class FilterInput extends PureComponent<FilterInputProps, State> {
    static displayName = 'FilterInput';

    state: Readonly<State> = {
        options: [],
        values: []
    };
    private input = createRef<HTMLInputElement>();

    componentDidMount() {
        const { defaultValue: values = [] } = this.props;

        this.setState({ values });
    }

    componentDidUpdate(lastProps: FilterInputProps, lastState: State) {
        const { defaultValue: values = [] } = this.props;

        if (
            lastProps.defaultValue + '' !== values + '' &&
            values + '' !== lastState.values + ''
        )
            this.setState({ values });
    }

    addOne(value: OptionItem) {
        const { values } = this.state;

        this.setState({ options: [], values: [...values, value] });

        this.input.current!.value = '';
    }

    deleteOne(index: number) {
        const { values } = this.state;

        this.setState({
            values: [...values.slice(0, index), ...values.slice(index + 1)]
        });
    }

    handleInput = (event: KeyboardEvent<HTMLInputElement>) => {
        const {
                key,
                currentTarget: { value }
            } = event,
            { values } = this.state;

        switch (key) {
            case 'Enter':
                if (value) {
                    event.preventDefault();

                    this.addOne({ label: value });
                }
                break;
            case 'Backspace':
                this.deleteOne(values.length - 1);
        }
    };

    loadOptions = debounce(async () => {
        const { loadOptions } = this.props;

        if (!loadOptions) return;

        const options = await loadOptions(this.input.current!.value);

        this.setState({ options });
    }, 250);

    render() {
        const { name, required } = this.props,
            { values, options } = this.state;

        return (
            <div className="form-control d-flex position-relative">
                {values.map((item, index) => (
                    <Badge key={index} className="me-2" bg="secondary">
                        <input
                            type="hidden"
                            name={name}
                            value={JSON.stringify(item)}
                        />
                        {item.label}
                        <Icon
                            className="ms-2"
                            name="x"
                            onClick={() => this.deleteOne(index)}
                        />
                    </Badge>
                ))}
                <input
                    ref={this.input}
                    className={style.input}
                    required={!values.length && required}
                    onKeyDown={this.handleInput}
                    onChange={this.loadOptions}
                />
                {options[0] && (
                    <ul className={`form-control ${style.options}`}>
                        {options.map((item, index) => (
                            <li key={index} onClick={() => this.addOne(item)}>
                                {item.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}
