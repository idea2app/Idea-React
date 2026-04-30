import { FC, HTMLAttributes, ReactNode } from 'react';

export const ZodiacSigns = ['🐵', '🐔', '🐶', '🐷', '🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐐'];

export interface ZodiacBarProps extends HTMLAttributes<HTMLOListElement> {
    itemClassName?: string;
    startYear: number;
    endYear?: number;
    itemOf?: (year: number, zodiac: string) => { link?: string; title?: ReactNode };
}

export const ZodiacBar: FC<ZodiacBarProps> = ({
    className = '',
    itemClassName = 'border rounded px-4 py-3 d-flex flex-column justify-content-center align-items-center',
    startYear,
    endYear = new Date().getFullYear(),
    itemOf,
    ...props
}) => (
    <ol
        className={`list-unstyled m-0 d-flex flex-wrap justify-content-center gap-3 ${className}`}
        {...props}
    >
        {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
            const year = endYear - index;
            const zodiac = ZodiacSigns[year % 12];
            const { link = '#', title } = itemOf?.(year, zodiac) || {};

            return (
                <li key={index} className={itemClassName}>
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
