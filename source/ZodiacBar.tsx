import { FC, HTMLAttributes, ReactNode } from 'react';

export const ZodiacSigns = ['🐵', '🐔', '🐶', '🐷', '🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐐'];

export interface ZodiacBarProps extends HTMLAttributes<HTMLOListElement> {
    startYear: number;
    endYear?: number;
    itemOf?: (year: number, zodiac: string) => { link?: string; title?: ReactNode };
}

export const ZodiacBar: FC<ZodiacBarProps> = ({
    startYear,
    endYear = new Date().getFullYear(),
    itemOf,
    ...props
}) => (
    <ol className="list-inline d-flex flex-wrap justify-content-center gap-3" {...props}>
        {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
            const year = endYear - index;
            const zodiac = ZodiacSigns[year % 12];
            const { link = '#', title } = itemOf?.(year, zodiac) || {};

            return (
                <li key={index} className="list-inline-item border rounded">
                    <a className="d-inline-block p-3 text-decoration-none text-center" href={link}>
                        <div className="fs-1">{zodiac}</div>

                        {title}
                    </a>
                </li>
            );
        })}
    </ol>
);

ZodiacBar.displayName = 'ZodiacBar';
