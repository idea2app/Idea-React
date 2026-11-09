import classNames from 'classnames';
import { cloneElement, FC, ReactElement } from 'react';

export interface FadeProps {
    children: ReactElement<{ className?: string }>;
    in?: boolean;
    className?: string;
}

export const Fade: FC<FadeProps> = ({ children, in: show = false, className = '' }) =>
    cloneElement(children, {
        className: classNames('fade', className, children.props.className, show && 'show')
    });

Fade.displayName = 'Fade';
