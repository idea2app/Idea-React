import { FC, HTMLAttributes } from 'react';

import { TypeEchoContent } from './Content';

export interface TypeEchoProps extends HTMLAttributes<HTMLPreElement> {
    text: string;
    intervals?: number;
}

export const TypeEcho: FC<TypeEchoProps> = ({ text, intervals, ...props }) => (
    <TypeEchoContent {...props} text={text} intervals={intervals} />
);

TypeEcho.displayName = 'TypeEcho';
