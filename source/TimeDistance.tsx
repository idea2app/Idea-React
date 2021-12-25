import React, { PropsWithoutRef } from 'react';
import { diffTime, TimeData } from 'web-utility';

export type TimeDistanceProps = PropsWithoutRef<{
    className?: string;
    date: TimeData;
    unitWords?: Record<string, string>;
    beforeWord?: string;
    afterWord?: string;
}>;

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

export function TimeDistance({
    className,
    date,
    unitWords = UnitWords,
    beforeWord = ' before',
    afterWord = ' after'
}: TimeDistanceProps) {
    date = new Date(date);

    const { distance, unit } = diffTime(date);

    return (
        <time
            className={className}
            dateTime={date.toJSON()}
            title={date.toLocaleString()}
        >
            {Math.abs(distance)} {unitWords[unit]}
            {distance < 0 ? beforeWord : afterWord}
        </time>
    );
}
