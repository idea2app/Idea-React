import React, { createRef, PropsWithChildren, PureComponent } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

interface State {
    showPopover: boolean;
    popoverTarget: EventTarget;
}

type IdeaPopoverProps = PropsWithChildren<{
    getData: Function;
    title: string;
}>;

export default class IdeaPopover extends PureComponent<
    IdeaPopoverProps,
    State
> {
    popoverRef = createRef();

    state = {
        showPopover: false,
        popoverTarget: {} as EventTarget
    };

    handleClick = async (event: React.MouseEvent) => {
        this.setState({
            popoverTarget: event.target
        });
        if (!this.state.showPopover) await this.props.getData();

        this.setState({
            showPopover: !this.state.showPopover
        });
    };

    render() {
        const { showPopover, popoverTarget } = this.state;
        const { title } = this.props;

        return (
            <div ref={this.popoverRef}>
                <div onClick={this.handleClick}>{this.props.children?.[0]}</div>

                <Overlay
                    show={showPopover}
                    target={popoverTarget}
                    placement="right"
                    container={this.popoverRef}
                >
                    <Popover id="popover-contained">
                        <Popover.Header as="h3">{title}</Popover.Header>
                        <Popover.Body>{this.props.children?.[1]}</Popover.Body>
                    </Popover>
                </Overlay>
            </div>
        );
    }
}
