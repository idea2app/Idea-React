import { FC, ReactNode } from 'react';
import {
    OverlayTrigger,
    OverlayTriggerProps,
    Popover,
    Tooltip
} from 'react-bootstrap';

export interface OverlayBoxProps extends Omit<OverlayTriggerProps, 'overlay'> {
    title: ReactNode;
    detail?: ReactNode;
}

/**
 * ToDo: {@link https://react-bootstrap.github.io/docs/components/overlays#disabled-elements}
 */
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
