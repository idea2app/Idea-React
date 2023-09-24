import classNames from 'classnames';
import * as MobX from 'mobx';
import { observer } from 'mobx-react';
import { observePropsState } from 'mobx-react-helper';
import { PureComponent, ReactNode } from 'react';
import { Badge, Button, ButtonProps, Table, TableProps } from 'react-bootstrap';
import {
    changeMonth,
    Day,
    formatDate,
    splitArray,
    TimeData} from 'web-utility';

import { OverlayBox } from './OverlayBox';

export interface DateData {
    date: TimeData;
    content: ReactNode;
}

export interface MonthCalendarProps
    extends Omit<TableProps, 'onChange' | 'onSelect'>,
        Pick<ButtonProps, 'variant'> {
    locale?: Navigator['language'];
    value?: DateData[];
    onSelect?: (value: DateData) => any;
    onChange?: (date: Date) => any;
}

/**
 * Re-implement from https://github.com/EasyWebApp/BootCell/blob/3d30027a97fe0a8c4ab8fabc8dfef22aede04de7/source/Calendar/MonthCalendar.tsx
 */
@observer
@observePropsState
export class MonthCalendar extends PureComponent<MonthCalendarProps> {
    static displayName = 'MonthCalendar';

    constructor({ variant = 'primary', ...props }: MonthCalendarProps) {
        super({ ...props, variant });

        MobX.makeObservable?.(this);
    }

    declare observedProps: MonthCalendarProps;

    @MobX.computed
    get weekFormatter() {
        const { locale = globalThis.navigator?.language } = this.observedProps;

        return new Intl.DateTimeFormat(locale, { weekday: 'long' });
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

        this.props.onChange?.(this.currentDate);
    }

    renderDate = (date: Date) => {
        const { variant, value, onSelect } = this.observedProps,
            dateText = formatDate(date, 'YYYY-MM-DD');
        const list = value?.filter(
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
            >
                <time className="d-block" dateTime={date.toJSON()}>
                    {date.getDate()}
                </time>

                {list?.map(item =>
                    typeof item.content === 'object' ? (
                        item.content
                    ) : (
                        <OverlayBox key={item.date + ''} title={item.content}>
                            <Badge
                                className="text-truncate"
                                bg={variant}
                                onClick={() => onSelect?.(item)}
                            >
                                {item.content}
                            </Badge>
                        </OverlayBox>
                    )
                )}
            </td>
        );
    };

    render() {
        const { weekFormatter, currentDate, dateGrid } = this,
            { variant } = this.observedProps;

        return (
            <Table style={{ tableLayout: 'fixed' }}>
                <caption>
                    <div className="d-flex justify-content-between align-items-center">
                        <Button
                            variant={variant}
                            onClick={() => this.changeMonth(-1)}
                        >
                            &lt;
                        </Button>

                        {formatDate(currentDate, 'YYYY-MM')}

                        <Button
                            variant={variant}
                            onClick={() => this.changeMonth(1)}
                        >
                            &gt;
                        </Button>
                    </div>
                </caption>
                <thead>
                    <tr>
                        {dateGrid[0].map((date, index, { length }) => (
                            <td
                                key={index}
                                className={`bg-${variant} text-white`}
                                style={{ width: `calc(100% / ${length})` }}
                            >
                                {weekFormatter.format(date)}
                            </td>
                        ))}
                    </tr>
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
