import { TimeHTMLAttributes } from 'react';
import { formatDate, TimeData } from 'web-utility';

import { polymorphic } from '../Base/Polymorphic';

export interface TimeProps extends Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'> {
    dateTime: TimeData;
    format?: string;
}

export const Time = polymorphic<TimeProps>(({ as: Root = 'time', dateTime, format, ...props }) => (
    <Root dateTime={new Date(dateTime).toJSON()} {...props}>
        {formatDate(dateTime, format)}
    </Root>
));

Time.displayName = 'Time';
