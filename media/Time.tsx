import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent, reaction } from 'mobx-react-helper';
import { TimeHTMLAttributes } from 'react';
import { formatDate, TimeData } from 'web-utility';

export interface TimeProps extends Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'> {
    dateTime: TimeData;
    format?: string;
}

@observer
export class Time extends ObservedComponent<TimeProps> {
    static displayName = 'Time';

    @reaction(({ observedProps: { dateTime, format } }) => dateTime + format)
    updateText() {
        const { dateTime, format } = this.props;

        return formatDate(dateTime, format);
    }

    @observable
    accessor timeText = this.updateText();

    componentDidMount() {
        super.componentDidMount();

        this.timeText = this.updateText();
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
