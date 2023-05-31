import { HTTPClient } from 'koajax';
import { observable } from 'mobx';
import { buildURLData } from 'web-utility';

export type CoordinateValue = `${number}.${number}`;

export interface Location {
    place_id: number;
    osm_id: number;
    osm_type: 'relation';
    boundingbox: [
        CoordinateValue,
        CoordinateValue,
        CoordinateValue,
        CoordinateValue
    ];
    lat: CoordinateValue;
    lon: CoordinateValue;
    display_name: string;
    licence: string;
}

export interface PossibleLocation extends Location {
    type: 'administrative';
    class: 'boundary';
    icon: number;
    importance: number;
}

export interface AddressLocation extends Location {
    address: Record<'ISO3166-2-lvl4' | 'country_code' | 'country', string> &
        Partial<
            Record<
                | 'state'
                | 'state_district'
                | 'town'
                | 'village'
                | 'road'
                | 'neighbourhood'
                | 'building'
                | 'house_number'
                | 'amenity'
                | 'postcode',
                string
            >
        >;
}

export class OpenMapModel {
    nominatimClient = new HTTPClient({
        baseURI: 'https://nominatim.openstreetmap.org',
        responseType: 'json'
    });

    @observable
    searchList: PossibleLocation[] = [];

    @observable
    reversedAddress: AddressLocation = {} as AddressLocation;

    /**
     * @see https://nominatim.org/release-docs/develop/api/Search/
     */
    async search(address: string) {
        const { body } = await this.nominatimClient.get<PossibleLocation[]>(
            `search?${new URLSearchParams({ q: address, format: 'json' })}`
        );
        return (this.searchList = body);
    }

    /**
     * @see https://nominatim.org/release-docs/develop/api/Reverse/
     */
    async reverse(lat: number, lon: number) {
        const { body } = await this.nominatimClient.get<AddressLocation>(
            `reverse?${buildURLData({ lat, lon, format: 'json' })}`
        );
        return (this.reversedAddress = body);
    }
}
