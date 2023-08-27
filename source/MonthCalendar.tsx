import classNames from 'classnames';
import * as MobX from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent, ReactNode } from 'react';
import { Button, Table, TableProps } from 'react-bootstrap';
import { Color } from 'react-bootstrap/esm/types';
import {
    changeMonth,
    Day,
    formatDate,
    splitArray,
    TimeData
} from 'web-utility';

interface DateData {
    date: TimeData;
    content: ReactNode;
}

export interface MonthCalendarProps extends Omit<TableProps, 'onChange'> {
    headBg?: Color;
    value?: DateData[];
    onChange?: (value: DateData) => any;
}

/**
 * Re-implement from https://github.com/EasyWebApp/BootCell/blob/3d30027a97fe0a8c4ab8fabc8dfef22aede04de7/source/Calendar/MonthCalendar.tsx
 */
@observer
export class MonthCalendar extends PureComponent<MonthCalendarProps> {
    static displayName = 'MonthCalendar';

    constructor(props: MonthCalendarProps) {
        super(props);
        MobX.makeObservable?.(this);
    }

    @MobX.observable
    currentDate = new Date();

    @MobX.computed
    get dateGrid() {
        let startDate = new Date(this.currentDate);
        startDate.setDate(1);
        startDate = new Date(+startDate - startDate.getDay() * Day);

        const dateList = Array.from(
            new Array(42),
            (_, index) => new Date(+startDate + index * Day)
        );
        return splitArray(dateList, 7);
    }

    changeMonth(delta: number) {
        this.currentDate = changeMonth(this.currentDate, delta);
    }

    renderDate = (date: Date) => {
        const { value, onChange } = this.props,
            dateText = formatDate(date, 'YYYY-MM-DD');
        const item = value?.find(
            ({ date }) => formatDate(date, 'YYYY-MM-DD') === dateText
        );

        return (
            <td
                key={date + ''}
                className={classNames({
                    'opacity-50':
                        date.getMonth() !== this.currentDate.getMonth(),
                    'fw-bold': dateText === formatDate(new Date(), 'YYYY-MM-DD')
                })}
                onClick={() => onChange?.(item)}
            >
                {date.getDate()}

                <div>{item?.content}</div>
            </td>
        );
    };

    render() {
        const { currentDate, dateGrid } = this,
            { headBg = 'primary' } = this.props;

        return (
            <Table>
                <caption>
                    <div className="d-flex justify-content-between align-items-center">
                        <Button onClick={() => this.changeMonth(-1)}>
                            &lt;
                        </Button>

                        {formatDate(currentDate, 'YYYY-MM')}

                        <Button onClick={() => this.changeMonth(1)}>
                            &gt;
                        </Button>
                    </div>
                </caption>
                <thead className={`bg-${headBg}`}>
                    {dateGrid[0].map((_, index) => (
                        <tr key={index}></tr>
                    ))}
                </thead>
                <tbody>
                    {dateGrid.map(days => (
                        <tr key={days[0] + ''}>{days.map(this.renderDate)}</tr>
                    ))}
                </tbody>
            </Table>
        );
    }
}
