import { FC, ReactNode } from 'react';
import {
    OverlayTrigger,
    OverlayTriggerProps,
    Popover,
    Tooltip
} from 'react-bootstrap';

export interface OverlayBoxProps extends OverlayTriggerProps {
    title: ReactNode;
    detail?: ReactNode;
}

export const OverlayBox: FC<OverlayBoxProps> = ({
    title,
    detail,
    children,
    ...props
}) => (
    <OverlayTrigger
        {...props}
        overlay={
            detail ? (
                <Popover>
                    <Popover.Header>{title}</Popover.Header>
                    <Popover.Body>{detail}</Popover.Body>
                </Popover>
            ) : (
                <Tooltip>{title}</Tooltip>
            )
        }
    >
        {children}
    </OverlayTrigger>
);

OverlayBox.displayName = 'OverlayBox';
