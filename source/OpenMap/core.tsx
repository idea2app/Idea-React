import { CamelEventName } from 'web-utility';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LeafletEventHandlerFnMap, LeafletMouseEventHandlerFn } from 'leaflet';
import {
    MapContainerProps,
    MapContainer,
    TileLayer,
    MarkerProps,
    Marker,
    Tooltip,
    Popup
} from 'react-leaflet';

import { OpenMapModel } from './model';

export type LeafLetComponent = 'TileLayer' | 'Marker';

export type MapEvent<N extends LeafLetComponent> = {
    [K in keyof LeafletEventHandlerFnMap as `on${N}${Capitalize<
        CamelEventName<K>
    >}`]: LeafletEventHandlerFnMap[K];
};

export interface MarkerMeta extends Pick<MarkerProps, 'position'> {
    tooltip?: string;
    popup?: string;
}

export interface OpenMapProps
    extends Pick<MapContainerProps, 'className' | 'style' | 'center' | 'zoom'>,
        MapEvent<'TileLayer'>,
        MapEvent<'Marker'> {
    markers?: MarkerMeta[];
    title?: string;
    address?: string;
    onChange?: (data: Required<Pick<OpenMapProps, 'title' | 'address'>>) => any;
}

/**
 * Don't forget to load LeafLet's CSS file, such as:
 *
 * ```html
 * <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" />
 * ```
 */
@observer
export default class OpenMap extends PureComponent<OpenMapProps> {
    store = new OpenMapModel();

    get eventHandlerMap() {
        return Object.entries(this.props).reduce((map, [key, value]) => {
            const [_, type, event] = key.match(/^on([A-Z][a-z]+)(.+)/) || [];

            if (type)
                (map[type as LeafLetComponent] ||= {})[
                    event.toLowerCase() as keyof LeafletEventHandlerFnMap
                ] = value as (...data: any[]) => any;

            return map;
        }, {} as Record<LeafLetComponent, LeafletEventHandlerFnMap>);
    }

    @computed
    get position(): [number, number] | undefined {
        const [location] = this.store.searchList;

        return location && [+location.lat, +location.lon];
    }

    @computed
    get center() {
        return this.position || this.props.center;
    }

    @computed
    get markers() {
        const { markers = [], address, title = address } = this.props,
            { position } = this;

        return [
            ...markers,
            ...(position ? [{ position, tooltip: title }] : [])
        ];
    }

    componentDidMount() {
        const { address } = this.props;

        if (address) this.store.search(address);
    }

    componentDidUpdate({ address }: Readonly<OpenMapProps>) {
        if (this.props.address !== address) this.componentDidMount();
    }

    changeAddress: LeafletMouseEventHandlerFn = async ({
        latlng: { lat, lng }
    }) => {
        const { onChange } = this.props;

        if (!onChange) return;

        const location = await this.store.reverse(lat, lng);

        if (!location) return;

        const {
            country,
            state,
            state_district,
            town,
            village,
            road,
            neighbourhood,
            building,
            house_number,
            amenity
        } = location.address;

        const address = [
            country,
            state,
            state_district,
            town,
            village,
            road,
            neighbourhood,
            building,
            house_number,
            amenity
        ]
            .filter(Boolean)
            .join('');

        onChange({ title: location.display_name, address });
    };

    renderAttribution() {
        return renderToStaticMarkup(
            <>
                &copy;
                <a
                    className="mx-1"
                    href="https://www.openstreetmap.org/copyright"
                >
                    OpenStreetMap
                </a>
                contributors
            </>
        );
    }

    render() {
        const { center, markers, eventHandlerMap } = this,
            {
                className = 'h-100',
                center: _,
                zoom,
                markers: __,
                onChange,
                children
            } = this.props;

        return !onChange && !center ? (
            children || <></>
        ) : (
            <MapContainer
                {...{ className, center, zoom }}
                doubleClickZoom={!onChange}
                touchZoom={!onChange}
                whenCreated={
                    onChange && (map => map.on('click', this.changeAddress))
                }
            >
                <TileLayer
                    attribution={this.renderAttribution()}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    eventHandlers={eventHandlerMap.TileLayer}
                />
                {markers.map(({ position, tooltip, popup }) => (
                    <Marker
                        key={position + ''}
                        position={position}
                        eventHandlers={eventHandlerMap.Marker}
                    >
                        {popup ? (
                            <Popup>{popup}</Popup>
                        ) : (
                            <Tooltip permanent>{tooltip}</Tooltip>
                        )}
                    </Marker>
                ))}
                {children}
            </MapContainer>
        );
    }
}
