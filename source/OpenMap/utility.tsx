import { RefCallback, useEffect } from 'react';
import { Map } from 'leaflet';
import { useMap } from 'react-leaflet';

export interface MapExposerProps {
    mapRef: RefCallback<Map>;
}

export function MapExposer({ mapRef }: MapExposerProps) {
    const map = useMap();

    useEffect(() => {
        mapRef(map);
    }, [map]);

    return <></>;
}
