import { FC, TimeHTMLAttributes } from 'react';
import { formatDate, TimeData } from 'web-utility';

export interface TimeProps
    extends Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'> {
    dateTime: TimeData;
    format?: string;
}

export const Time: FC<TimeProps> = ({ dateTime, format, ...props }) => (
    <time dateTime={new Date(dateTime).toJSON()} {...props}>
        {formatDate(dateTime, format)}
    </time>
);
