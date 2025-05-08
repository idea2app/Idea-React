import { FC, HTMLAttributes } from 'react';
import { Card } from 'react-bootstrap';
import { TimeData } from 'web-utility';

import { Nameplate, NameplateProps } from '../Nameplate';
import { Time } from '../Time';
import * as styles from './index.module.less';

export interface TimelineEvent {
    title: string;
    summary?: string;
    time: [TimeData, TimeData?];

    link?: string;
    people?: NameplateProps[];
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
    events: TimelineEvent[];
    timeFormat?: string;
}

/**
 * @see {@link https://mdbootstrap.com/docs/standard/extended/timeline/#section-timeline-gradient-bg}
 */
export const Timeline: FC<TimelineProps> = ({ className, events, timeFormat, ...props }) => (
    <ol className={`list-unstyled ${styles.timeline} ${className}`} {...props}>
        {events.map(({ title, summary, time, link, people }) => (
            <li
                key={title as string}
                className={`position-relative ${styles.timelineItem} ${styles.right}`}
            >
                <Card>
                    <Card.Body className="p-4 d-flex flex-column gap-3 align-items-center">
                        <h3 className="h5 m-0">
                            <a className="text-decoration-none stretched-link" href={link}>
                                {title as string}
                            </a>
                        </h3>
                        <div className="small text-muted d-flex gap-2">
                            ⏲️
                            <Time dateTime={time[0]} format={timeFormat} />
                            {time[1] && '~'}
                            {time[1] && <Time dateTime={time[1]} format={timeFormat} />}
                        </div>
                        <ul className="list-unstyled m-0 d-flex gap-2 flex-wrap justify-content-around">
                            {people?.map(person => (
                                <li key={person.name}>
                                    <Nameplate {...person} />
                                </li>
                            ))}
                        </ul>
                        <p className="m-0">{summary as string}</p>
                    </Card.Body>
                </Card>
            </li>
        ))}
    </ol>
);
Timeline.displayName = 'Timeline';
