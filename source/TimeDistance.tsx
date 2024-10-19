import { FC, HTMLAttributes } from 'react';
import { diffTime, TimeData } from 'web-utility';

export interface TimeDistanceProps extends HTMLAttributes<HTMLTimeElement> {
    date: TimeData;
    unitWords?: Record<string, string>;
    beforeWord?: string;
    afterWord?: string;
}

const UnitWords = {
    ms: 'millisecond(s)',
    s: 'second(s)',
    m: 'minute(s)',
    H: 'hour(s)',
    D: 'day(s)',
    W: 'week(s)',
    M: 'month(s)',
    Y: 'year(s)'
};

export const TimeDistance: FC<TimeDistanceProps> = ({
    date,
    unitWords = UnitWords,
    beforeWord = ' before',
    afterWord = ' after',
    ...props
}) => {
    date = new Date(date);

    const { distance, unit } = diffTime(date);

    return (
        <time {...props} dateTime={date.toJSON()} title={date.toLocaleString()}>
            {Math.abs(distance)} {unitWords[unit]}
            {distance < 0 ? beforeWord : afterWord}
        </time>
    );
};

TimeDistance.displayName = 'TimeDistance';
