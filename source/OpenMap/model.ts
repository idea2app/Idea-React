import { observable } from 'mobx';
import { HTTPClient } from 'koajax';

const client = new HTTPClient({ responseType: 'json' });

export type CoordinateValue = `${number}.${number}`;

export interface Location {
    place_id: number;
    osm_id: number;
    osm_type: 'relation';
    type: 'administrative';
    class: 'boundary';
    boundingbox: [
        CoordinateValue,
        CoordinateValue,
        CoordinateValue,
        CoordinateValue
    ];
    lat: CoordinateValue;
    lon: CoordinateValue;
    display_name: string;
    icon: number;
    importance: number;
    licence: string;
}

export class OpenMapModel {
    @observable
    locations: Location[] = [];

    async search(address: string) {
        const { body } = await client.get<Location[]>(
            `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
                q: address,
                format: 'json'
            })}`
        );
        return (this.locations = body);
    }
}
