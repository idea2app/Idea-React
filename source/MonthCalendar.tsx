'use client';

import classNames from 'classnames';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { changeMonth, Day, formatDate, splitArray, TimeData } from 'web-utility';

import { Badge } from './Badge';
import { Button, type ComponentTheme } from './Button';
import { text2color } from './color';
import { OverlayBox } from './OverlayBox';

export interface DateData {
    date: TimeData;
    content: ReactNode;
    link?: string;
}

export interface MonthCalendarProps extends Omit<
    HTMLAttributes<HTMLTableElement>,
    'onChange' | 'onSelect'
> {
    locale?: Navigator['language'];
    theme?: ComponentTheme;
    value?: DateData[];
    onSelect?: (value: DateData) => void;
    onChange?: (date: Date) => void;
}

/**
 * Re-implement from https://github.com/EasyWebApp/BootCell/blob/3d30027a97fe0a8c4ab8fabc8dfef22aede04de7/source/Calendar/MonthCalendar.tsx
 */
@observer
export class MonthCalendar extends ObservedComponent<MonthCalendarProps> {
    static displayName = 'MonthCalendar';

    @computed
    get weekFormatter() {
        const { locale = globalThis.navigator?.language } = this.observedProps;

        return new Intl.DateTimeFormat(locale, { weekday: 'long' });
    }

    @observable
    accessor currentDate = new Date();

    @computed
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

    @action
    changeMonth(delta: number) {
        this.currentDate = changeMonth(this.currentDate, delta);

        this.props.onChange?.(this.currentDate);
    }

    changePreviousMonth = () => this.changeMonth(-1);
    changeNextMonth = () => this.changeMonth(1);

    handleCellClick = ({ target, currentTarget }: MouseEvent<HTMLTableCellElement>) => {
        if (!(target instanceof Element)) return;

        const targetItem = target.closest<HTMLElement>('[data-calendar-index]');
        if (!targetItem || !currentTarget.contains(targetItem)) return;

        const date = targetItem.dataset.calendarDate;
        const index = Number(targetItem.dataset.calendarIndex);
        const items = this.props.value?.filter(
            ({ date: itemDate }) => formatDate(itemDate, 'YYYY-MM-DD') === date
        );
        const item = items?.[index];

        if (item) this.props.onSelect?.(item);
    };

    renderDate = (date: Date) => {
        const { value } = this.observedProps,
            dateText = formatDate(date, 'YYYY-MM-DD');
        const list = value?.filter(({ date }) => formatDate(date, 'YYYY-MM-DD') === dateText);

        return (
            <td
                key={date + ''}
                className={classNames({
                    'opacity-50': date.getMonth() !== this.currentDate.getMonth(),
                    'fw-bold': dateText === formatDate(new Date(), 'YYYY-MM-DD')
                })}
                onClick={this.handleCellClick}
            >
                <time className="d-block" dateTime={date.toJSON()}>
                    {date.getDate()}
                </time>

                {list?.map((item, index) =>
                    typeof item.content === 'object' ? (
                        item.content
                    ) : (
                        <OverlayBox key={`${dateText}-${index}`} title={item.content}>
                            {item.link ? (
                                <Badge
                                    href={item.link}
                                    className="d-inline-block text-decoration-none w-100 text-truncate"
                                    data-calendar-date={dateText}
                                    data-calendar-index={index}
                                    theme={text2color(item.content + '', ['light'])}
                                >
                                    {item.content}
                                </Badge>
                            ) : (
                                <Badge
                                    className="d-inline-block text-decoration-none w-100 text-truncate"
                                    data-calendar-date={dateText}
                                    data-calendar-index={index}
                                    theme={text2color(item.content + '', ['light'])}
                                >
                                    {item.content}
                                </Badge>
                            )}
                        </OverlayBox>
                    )
                )}
            </td>
        );
    };

    render() {
        const { weekFormatter, currentDate, dateGrid } = this,
            {
                className,
                style,
                theme = 'primary',
                onChange: _onChange,
                onSelect: _onSelect,
                ...props
            } = this.observedProps;

        return (
            <table
                {...props}
                className={`table ${className || ''}`}
                style={{ tableLayout: 'fixed', ...style }}
            >
                <caption>
                    <div className="d-flex justify-content-between align-items-center">
                        <Button theme={theme} onClick={this.changePreviousMonth}>
                            &lt;
                        </Button>

                        {formatDate(currentDate, 'YYYY-MM')}

                        <Button theme={theme} onClick={this.changeNextMonth}>
                            &gt;
                        </Button>
                    </div>
                </caption>
                <thead>
                    <tr>
                        {dateGrid[0].map((date, index, { length }) => (
                            <th
                                key={index}
                                className={`theme-${theme} theme-contrast`}
                                style={{ width: `calc(100% / ${length})` }}
                                scope="col"
                            >
                                {weekFormatter.format(date)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dateGrid.map(days => (
                        <tr key={days[0] + ''}>{days.map(this.renderDate)}</tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
