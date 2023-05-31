import { FC, lazy, Suspense } from 'react';

import { Loading } from '../Loading';
import type { OpenMapProps } from './core';

export type {
    LeafLetComponent,
    MapEvent,
    MarkerMeta,
    OpenMapProps
} from './core';
export type {
    CoordinateValue,
    Location,
    AddressLocation as ReverseItem,
    PossibleLocation as SearchItem
} from './model';

const Map = lazy(() => import('./core'));

export const OpenMap: FC<OpenMapProps> = props => (
    <Suspense fallback={<Loading />}>
        <Map {...props} />
    </Suspense>
);
OpenMap.displayName = 'OpenMap';
