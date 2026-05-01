import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { TimeHTMLAttributes } from 'react';
import { formatDate, TimeData } from 'web-utility';

export interface TimeProps extends Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'> {
    dateTime: TimeData;
    format?: string;
}

@observer
export class Time extends ObservedComponent<TimeProps> {
    static displayName = 'Time';

    @observable
    accessor mounted = false;

    componentDidMount() {
        super.componentDidMount();
        this.mounted = true;
    }

    render() {
        const { dateTime, format, ...props } = this.props;
        const date = new Date(dateTime);

        return (
            <time dateTime={date.toJSON()} {...props}>
                {this.mounted ? formatDate(dateTime, format) : date.toJSON()}
            </time>
        );
    }
}
