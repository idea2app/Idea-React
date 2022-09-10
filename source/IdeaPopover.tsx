import { createRef, PropsWithChildren, PureComponent } from 'react';
import { Overlay, Popover } from 'react-bootstrap';

interface State {
    showPopover: boolean;
    popoverTarget: EventTarget;
}

export type IdeaPopoverProps = PropsWithChildren<{
    onShow?: () => any;
    title: string;
}>;

export class IdeaPopover extends PureComponent<IdeaPopoverProps, State> {
    static displayName = 'IdeaPopover';

    popoverRef = createRef<HTMLDivElement>();

    state = {
        showPopover: false,
        popoverTarget: {} as HTMLDivElement
    };

    handleClick = async (event: React.MouseEvent) => {
        const { showPopover } = this.state;

        this.setState({
            popoverTarget: event.target
        });
        if (!showPopover) this.props.onShow?.();

        this.setState({ showPopover: !showPopover });
    };

    render() {
        const { showPopover, popoverTarget } = this.state;
        const { title, children } = this.props;

        return (
            <div ref={this.popoverRef}>
                <div onClick={this.handleClick}>{children?.[0]}</div>

                <Overlay
                    show={showPopover}
                    target={popoverTarget}
                    placement="right"
                    container={this.popoverRef}
                >
                    <Popover id="popover-contained">
                        <Popover.Header as="h3">{title}</Popover.Header>
                        <Popover.Body>{children?.[1]}</Popover.Body>
                    </Popover>
                </Overlay>
            </div>
        );
    }
}
