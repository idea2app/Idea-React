import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, TimeHTMLAttributes } from 'react';
import { formatDate, TimeData } from 'web-utility';

export interface TimeProps extends Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'> {
    dateTime: TimeData;
    format?: string;
}

@observer
export class Time extends Component<TimeProps> {
    static displayName = 'Time';

    @observable
    accessor timeText = formatDate(this.props.dateTime, this.props.format);

    componentDidMount() {
        this.timeText = formatDate(this.props.dateTime, this.props.format);
    }

    render() {
        const { dateTime, ...props } = this.props;

        return (
            <time dateTime={new Date(dateTime).toJSON()} {...props}>
                {this.timeText}
            </time>
        );
    }
}
