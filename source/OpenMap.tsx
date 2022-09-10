import { CamelEventName } from 'web-utility';
import { PureComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LeafletEventHandlerFnMap } from 'leaflet';
import {
    MapContainerProps,
    MapContainer,
    TileLayer,
    MarkerProps,
    Marker,
    Tooltip,
    Popup
} from 'react-leaflet';

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
    extends Pick<MapContainerProps, 'center' | 'zoom'>,
        MapEvent<'Marker'> {
    markers?: MarkerMeta[];
}

export class OpenMap extends PureComponent<OpenMapProps> {
    static displayName = 'OpenMap';

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

    renderAttribution() {
        return renderToStaticMarkup(
            <>
                &copy;
                <a
                    className="mx-1"
                    href="https://www.openstreetmap.org/copyright"
                >
                    OpenMap
                </a>
                contributors
            </>
        );
    }

    render() {
        const { center, zoom, markers, children } = this.props,
            { eventHandlerMap } = this;

        return (
            <MapContainer {...{ center, zoom }} style={{ height: '100%' }}>
                <TileLayer
                    attribution={this.renderAttribution()}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    eventHandlers={eventHandlerMap.TileLayer}
                />
                {markers?.map(({ position, tooltip, popup }) => (
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
