import { PropsWithChildren, PureComponent, SyntheticEvent } from 'react';
import { Modal } from 'react-bootstrap';

export interface MapData {
    address: string;
    name: string;
    longitude?: number;
    latitude?: number;
    location?: string;
}

export type AddressPickerProps = PropsWithChildren<{
    onChange: (data: MapData) => any;
}>;

export class AddressPicker extends PureComponent<
    AddressPickerProps,
    { open: boolean }
> {
    static displayName = 'AddressPicker';

    state = {
        open: false
    };

    componentWillUnmount() {
        window.removeEventListener('message', this.getLocation, false);
    }

    getLocation = ({
        data: { name, address, location }
    }: {
        data: MapData;
    }) => {
        const [longitude, latitude] = location.split(',');

        this.setState({ open: false });
        this.props.onChange({
            name,
            address,
            longitude: +longitude,
            latitude: +latitude
        });
    };

    loadIframe = ({
        currentTarget: { contentWindow: iframe }
    }: SyntheticEvent<HTMLIFrameElement>) => {
        iframe.postMessage('hello', 'https://m.amap.com/picker/');
        window.addEventListener('message', this.getLocation, false);
    };

    renderMap() {
        const { open } = this.state;

        return (
            <Modal
                show={open}
                size="lg"
                onHide={() => this.setState({ open: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Address Picker</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe
                        id="getAddress"
                        src="https://m.amap.com/picker/?key=ffebcf5feb145551bf438b57c08b4b53"
                        className="bg-white w-100"
                        style={{ height: '50rem' }}
                        onLoad={this.loadIframe}
                    />
                </Modal.Body>
            </Modal>
        );
    }

    render() {
        return (
            <>
                <span onClick={() => this.setState({ open: true })}>
                    {this.props.children}
                </span>
                {this.renderMap()}
            </>
        );
    }
}
