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
    extends Pick<MapContainerProps, 'className' | 'style' | 'center' | 'zoom'>,
        MapEvent<'Marker'> {
    markers?: MarkerMeta[];
}

/**
 * Don't forget to load LeafLet's CSS file, such as:
 *
 * ```html
 * <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" />
 * ```
 */
export default class OpenMap extends PureComponent<OpenMapProps> {
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
                    OpenStreetMap
                </a>
                contributors
            </>
        );
    }

    render() {
        const { className = 'h-100', markers, children, ...props } = this.props,
            { eventHandlerMap } = this;

        return (
            <MapContainer {...props} className={className}>
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
